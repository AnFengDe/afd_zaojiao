'use strict';
const co = require('co');
var i_blockchains = require('./database/interface/i_blockchains');
var i_school = require('./database/interface/i_school');
var {res_have_result} = require('./database/tool');
var config = require('config').blockchains;

var JingtumSDK = require('jingtum-sdk');
var FinGate = JingtumSDK.FinGate;
var Wallet = JingtumSDK.Wallet;
var Amount = JingtumSDK.Amount;
var PaymentOperation = JingtumSDK.PaymentOperation;

var bc = {
    /**
    通过银关向指定的钱包发行签到积分
    每个新加入的学校和学生，我们应该向所属钱包自动充一个初始资金，以利于后续交易
    当学生退学和学校停办，所属钱包中余额全额转账到公司的钱包中。
    通过银关发行用户通到学校和学生钱包是一个办法，另外一个办法是发行用户通到公司钱包中，
    学校和学生的钱包预置充值通过公司钱包转账，我们采取第二个办法。

    NOTE:本方法仅仅测试银关发行能力，不在用于钱包预置充值
    @param {String} address 用户通发行钱包地址
    @param {String} type 钱包类型，school是学校钱包， child是学生钱包
    @return {Object} 失败返回null, 成功返回true
    */
    issueIntegration: function(address, type) {
        let currency = config.currency;
        return co(function * () {
            address = address || 0;
            if (!address) {
                console.error("address is invalid");
                return Promise.resolve(null);
            }
            type = type || 'child';
            var amount = (type == 'school'
                ? 100
                : 25) + '.00';

            return new Promise(function(resolve, reject) {
                FinGate.issueCustomTum(currency, amount, address, function(err, data) {
                    // console.log("issue Integration err:" + JSON.stringify(err));
                    // console.log("issue Integration data:" + JSON.stringify(data));
                    resolve(true);
                });
            });
        });
    },
    format_amount: function(amount) {
        if (typeof amount == 'string') {
            amount = parseFloat(amount);
        }
        if (isNaN(amount)) {
            return '0.00';
        }

        return amount.toFixed(2);
    },
    /**
    清空钱包中的用户通，多用于学生退学和学校停办
    @param {String} src 发起方钱包秘钥
    @param {String} note 交易说明
    @param {String} currency 货币 为空则是用户通
    @return {boolean} true表示成功，false表示失败
    */
    transfer_all: function(src, note, currency) {
        currency = (typeof currency == 'undefined' || currency == null)
            ? config.currency
            : currency;
        let self = this;
        return co(function * () {
            var w_src = new Wallet(src);
            return new Promise(function(resolve, reject) {
                w_src.getBalance(function(err, data) {
                    if (err) {
                        console.error("Get Balance err:" + JSON.stringify(err));
                        reject(false);
                        return;
                    }
                    let balance = null;
                    for (var i in data.balances) {
                        if (data.balances[i].currency == currency) {
                            balance = data.balances[i];
                            break;
                        }
                    }
                    if (!balance) {
                        console.error("Get Balance can not find currency:" + currency);
                        //没钱根本不需要转
                        resolve(true);
                        return;
                    }
                    //console.log("Get Balance:" + JSON.stringify(data));
                    resolve(balance.value);
                });
            });
        }).then(function(data) {
            if (currency == 'SWT') {
                data = data - 12;
            }
            return self.transfer(src, config.secret, data, note, currency);
        }).catch(function(err) {
            return Promise.resolve(false);
        });
    },
    /**
    转账
    @param {String} src 发起方钱包秘钥
    @param {String} dst 接收方钱包秘钥
    @param {float} amount 转账金额,必须携带两位小数
    @param {String} note 交易说明
    @param {String} currency 货币 为空则是用户通
    @return {boolean} true表示成功，false表示失败
    */
    transfer: function(src, dst, amount, note, currency) {
        currency = (typeof currency == 'undefined' || currency == null)
            ? config.currency
            : currency;
        let issuer = currency == config.currency
            ?config.issuer
            : "";
        note = note || '';

        amount = this.format_amount(amount);
        var w_src = new Wallet(src);
        var w_dst = new Wallet(dst);
        var payment = new PaymentOperation(w_src);

        payment.setValidate(false);
        payment.setDestAddress(w_dst.address);
        payment.setMemo(note);
        payment.setAmount({'currency': currency, 'value': amount, 'issuer': issuer});
        //console.log("Amount:" + JSON.stringify(payment._amount));
        /*{
            "success": true,
            "client_resource_id": "PREFIX36467420170405190803000001",
            "msg": "transaction saved in our database"
        }*/
        return co(function * () {
            return new Promise(function(resolve, reject) {
                if (amount == '0.00' || amount == "-0.00") {
                    resolve(false);
                }
                payment.submit(function(err, data) {
                    var ret = (err
                        ? false
                        : data.success);
                    if (!ret) {
                        console.error("Payment err:" + JSON.stringify(err) + "\nPayment data:" + JSON.stringify(data));
                    }
                    resolve(ret);
                });
            });
        });
    },
    /**
    查询指定钱包的交易清单
    @param {String} src 需要查询的钱包秘钥
    @param {number} count 一页多少数据 默认10
    @param {number} page 第几页
    @return {Object} 交易清单
    */
    queryPaymentList: function(src, count, page) {
        count = count || 10;
        page = page || 1;

        var w_src = new Wallet(src);

        var options = {
            results_per_page: count,
            page: page
        };

        /* 数据返回样式
        {
            "success" : true,
            "payments" : [
                {
                    "date": 1491394150,
                    "hash": "15A9AFF166B9767E18FDFDFD1F69BA649292272D8349C30F1851D1D2C6F87FB9",
                    "type": "sent",
                    "fee": "0.000012",
                    "result": "tesSUCCESS",
                    "client_resource_id": "PREFIX77987920170405200900000001",
                    "memos": [
                        {
                            "MemoData": "婆婆放学了",
                            "MemoType": "string"
                        }
                    ],
                    "counterparty": "jH8tU9jFYvcZgLtt1XqyHMMaQEitp6Bjh2",
                    "amount": {
                        "value": "0.01",
                        "currency": "CFDD2CAF4EF0830E418E9FF691BA9C469AFEE8F2",
                        "issuer": "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
                    },
                    "effects": []
                }
            ]
        }
        */
        return co(function * () {
            return new Promise(function(resolve, reject) {
                w_src.getPaymentList(options, function(err, data) {
                    //console.log("Payment err:" + JSON.stringify(err));
                    //console.log("Payment data:" + JSON.stringify(data));
                    resolve(err
                        ? null
                        : data);
                });
            });
        });
    },
    /**
    创建钱包，返回钱包秘钥
    @return {String} 钱包秘钥
    */
    create_wallet: function() {
        var w = FinGate.createWallet();
        console.log("Wallet Address:" + w.address + " secret:" + w.secret);
        return w.secret;
    },
    active_wallet: function(secret) {
        var w = new Wallet(secret);
        return co(function * () {
            return new Promise(function(resolve, reject) {
                FinGate.activateWallet(w.address, function(err, result) {
                    if (err) {
                        console.error("active wallet err:" + JSON.stringify(err));
                        console.error("active wallet result:" + JSON.stringify(result));
                    }
                    resolve(err
                        ? false
                        : true);
                });
            });
        });
    },
    //-------------------------------------------
    build_school_task: function(school, secret, amount, operator) {
        return {
            type: 'school',
            schoolid: school.schoolid,
            wallet: {
                secret: secret,
                amount: amount
            },
            note: {
                text: school.name + '初次使用系统充值',
                timestamp: Date().now,
                user: operator
            }
        };
    },
    process_school_task: function(task) {
        var self = this;
        return co(function * () {
            let ret = yield self.active_wallet(task.wallet.secret);
            if (!ret) {
                return Promise.resolve(false);
            }
            return self.transfer(config.secret, task.wallet.secret, task.wallet.amount, JSON.stringify(task.note));
        });
    },
    build_register_task: function(schoolid, secret, amount, child, operator) {
        return {
            type: 'register',
            schoolid: schoolid,
            wallet: {
                secret: secret,
                amount: amount
            },
            note: {
                text: child.name + '学生报名入学充值',
                timestamp: Date().now,
                user: operator,
                child: child
            }
        };
    },
    process_register_task: function(task) {
        var self = this;
        return co(function * () {
            let ret = yield self.active_wallet(task.wallet.secret);
            if (!ret) {
                return Promise.resolve(false);
            }
            return self.transfer(config.secret, task.wallet.secret, task.wallet.amount, JSON.stringify(task.note));
        });
    },
    build_check_task: function(type, school, child, amount, text, operator) {
        return {
            type: type,
            schoolid: school.schoolid,
            wallet: {
                school_secret: school.wallet,
                child_secret: child.wallet,
                amount: amount
            },
            note: {
                text: text,
                timestamp: Date().now,
                user: operator,
                child: child
            }
        };
    },
    process_check_task: function(task) {
        var self = this;
        return co(function * () {
            let src,
                dst
            if (type == 'checkin') {
                src = task.wallet.school_secret;
                dst = task.wallet.child_secret;
            } else {
                dst = task.wallet.school_secret;
                src = task.wallet.child_secret;
            }
            return self.transfer(src, dst, task.wallet.amount, JSON.stringify(task.note));
        });
    },
    build_quit_task: function(school, child, operator) {
        return {
            type: "quit",
            schoolid: school.schoolid,
            wallet: {
                school_secret: school.wallet,
                child_secret: child.wallet
            },
            note: {
                text: school.name + "的" + child.name + "退学了",
                timestamp: Date().now,
                user: operator,
                child: child
            }
        };
    },
    process_quit_task: function(task) {
        var self = this;
        return co(function * () {
            //转移SWT，转移用户通
            let ret = yield self.transfer_all(task.wallet.child_secret, JSON.stringify(task.noet), 'SWT');
            if (!ret) {
                return Promise.resolve(false);
            }
            return self.transfer_all(task.wallet.child_secret, JSON.stringify(task.noet));
        });
    },
    /**
    扫描监视当前的区块链任务表，并执行，记录
    如果检查不到任务则30秒钟自动执行一次，否则持续执行
    */
    start_task: function() {
        console.log("执行检查任务.....");
        var self = this;
        var timeout = 30000;
        return co(function * () {
            //查询学校
            let schools;
            let school_res = yield i_school.all();
            if (!res_have_result(school_res)) {
                setTimeout(function() {
                    self.start_task();
                }, timeout);
                return Promise.resolve(false);
            }

            schools = school_res.result;
            for (var i in schools) {
                //查找任务
                var tasks_res = i_blockchains.get_blockchains_task(schools[i].schoolid);
                if (!tasks_res.result_code) {
                    continue;
                }
                if (!tasks_res.result.length) {
                    continue;
                }

                let tasks = tasks_res.result;
                for (var j in tasks) {
                    let ret = false;
                    console.log("开始处理任务:" + tasks[j].task);
                    let task = JSON.parse(tasks[j].task);
                    if (task.type == 'school') {
                        ret = yield self.process_school_task(task);
                    }
                    if (task.type == 'register') {
                        ret = yield self.process_register_task(task);
                    }
                    if (task.type == 'checkin' || task.type == 'checkout') {
                        ret = yield self.process_check_task(task);
                    }
                    if (task.type == 'quit') {
                        ret = yield self.process_quit_task(task);
                    }

                    //执行不成功则需要终止，继续下一次触发，因为付费本身是有顺序的
                    if (!ret) {
                        break;
                    }
                    //执行成功则需要删除该任务数据
                    yield i_blockchains.delete(tasks[j].schoolid, tasks[j].timestamp);
                }
                //有数据时提高处理频率
                timeout = 1000;
            }

            setTimeout(function() {
                self.start_task();
            }, timeout);

            return Promise.resolve(true);
        }).catch(function(err) {
            console.error("区块链定时任务异常: " + JSON.stringify(err));
            setTimeout(function() {
                self.start_task();
            }, timeout);
        });
    }
};

if (config.enable) {
    FinGate.setAccount(config.secret);
    console.log("FinGate secret:" + FinGate.secret + " address:" + FinGate.address);

    //设置银关工作模式
    if (process.env.NODE_ENV == "production") {
        FinGate.setMode(FinGate.PRODUCTION);
        console.log("FinGate in production mode, issuer:" + config.issuer);
    } else {
        FinGate.setMode(FinGate.DEVELOPEMENT);
        console.log("FinGate in developement mode, issuer:" + config.issuer);
    }

    FinGate.setToken(config.token);
    FinGate.setKey(config.key);
}

module.exports = bc;
