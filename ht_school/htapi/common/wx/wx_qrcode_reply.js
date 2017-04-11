/*
微信构造二维码共通
*/
'use strict';
/*
生成二维码
type
临时二维码：0:学校管理员申请 1:教师申请 2: 家长登记确认
永久二维码：100:学生二维码签到 101:学生二维码签退 102: 学校二维码签到 103:学校二维码签退
成功返回二维码图像文件的链接，否则返回空
*/

var co = require('co');
var config = require('config');
const i_school_admin = require('../database/interface/i_school_admin');
const i_school = require('../database/interface/i_school');
const i_children = require('../database/interface/i_children');
const i_teachers = require('../database/interface/i_teachers');
const i_parent = require('../database/interface/i_parent');
const i_check = require('../database/interface/i_check');
const i_qr = require('../database/interface/i_qr');
const i_blockchains = require('../database/interface/i_blockchains');
const bc = require('../blockchains');

const {
    get_date_begin_end,
    check_time,
    is_empty,
    res_have_result,
    getHash,
    format_date
} = require('../database/tool')

const {get_redirect_menu} = require('../database/tool')

/*
二维码的类型
说明：临时性的二维码不需要保存，临时生成的ticket直接发送到客户端
永久性的二维码需要保存到数据表中，可以通过查询数据库表获取
*/
var qr_type = {
    admin_register: 0,
    teacher_register: 1,
    parent_register: 2,
    teacher_verification: 3,
    parent_verification: 4,
    student_check_in: 100,
    student_check_out: 101,
    school_check_in: 102,
    school_check_out: 103
};

var send_template_parent_child = function(check_data, child, parent) {
    return co(function * () {
        let school_res = yield i_school.exist(child.schoolid);
        if (!res_have_result(school_res)) {
            console.log("schoolid:" + child.schoolid + " 找不到学校数据");
            return Promise.resolve(null);
        }
        return (yield wx_send_check_template(check_data, child, null, parent, school_res.result[0]));
    });
};

var send_template_child = function(check_data, child, teacher) {
    return co(function * () {
        let school_res = yield i_school.exist(child.schoolid);
        if (!res_have_result(school_res)) {
            console.log("schoolid:" + child.schoolid + " 找不到学校数据");
            return Promise.resolve(null);
        }
        return (yield wx_send_check_template(check_data, child, teacher, null, school_res.result[0]));
    });
};

/*
发送学生接送模板消息
1.老师扫码，找出学生关联的所有家长逐个发送消息
2.家长扫码，找出学生所有家长，除了扫码家长之外其他家长发送消息
*/
var wx_send_check_template = function(check_data, child, teacher, parent, school) {
    return co(function * () {
        let parent_res = yield i_parent.get_by_child(child.childid);
        if (!res_have_result(parent_res)) {
            console.error("找不到孩子的家长:" + JSON.stringify(child));
            return Promise.resolve(null);
        }
        for (var index in parent_res.result) {
            let p = parent_res.result[index];
            if (!is_empty(parent) && p.parentid == parent.parentid) {
                continue;
            }
            let t_data = {
                "first": {
                    "value": p.name + "家长-安风德幼教接送通知",
                    "color": "#173177"
                },
                "keyword1": {
                    "value": child.name,
                    "color": "#173177"
                },
                "keyword2": {
                    "value": is_empty(parent)
                        ? teacher.name
                        : parent.name,
                    "color": "#173177"
                },
                "keyword3": {
                    "value": check_time(check_data.checktime),
                    "color": "#173177"
                },
                "keyword4": {
                    "value": school.name,
                    "color": "#173177"
                },
                "keyword5": {
                    "value": school.address,
                    "color": "#173177"
                },
                "remark": {
                    "value": child.name + (check_data.type == 1
                        ? "宝宝已经到校，快乐上学每一天"
                        : "宝宝已经离校，请知晓"),
                    "color": "#173177"
                }
            };
            //console.log(JSON.stringify(t_data));
            return new Promise(function(resolve, reject) {
                wxapi.sendTemplate(p.openid, "KWR4MR60SDpntiLdXlhzdXKu80Mvnjv5WBql4m2WNO4", "", t_data, function(err, data, res) {
                    if (err) {
                        console.error("模板发送错误:" + JSON.stringify(err));
                    } else {
                        // console.log((new Date()) + ":" + "模板发送:" + JSON.stringify(data) + "--" + JSON.stringify(res));
                    }
                    resolve(null);
                });
            });
        }
    });
};

/**
创建临时二维码，固定失效时间为24小时
@param type 二维码类型
@return promise对象，成功直接返回二维码数据，失败返回二维码错误
*/
var wx_create_tmp = function(type) {
    return co(function * () {
        if (type == null) {
            Promise.reject(null);
        }

        return new Promise(function(resolve, reject) {
            wxapi.createTmpQRCode(type, 86400, function(err, data, res) {
                if (typeof data.ticket !== 'undefined') {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }).catch(function(err) {
        return Promise.reject(err);
    });
};

/**
创建永久二维码
@param type 二维码类型
@return promise对象，成功直接返回二维码数据，失败返回二维码错误
*/
var wx_create_limit = function(type) {
    return co(function * () {
        if (type == null) {
            Promise.reject(null);
        }

        return new Promise(function(resolve, reject) {
            wxapi.createLimitQRCode(type, function(err, data, res) {
                if (typeof data.ticket !== 'undefined') {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }).catch(function(err) {
        return Promise.reject(err);
    });
};

/**
处理学校签到的画面显示
@param {Boolean} checkin 是否签到
@param {Object} msg 消息结构
@return promise对象，成功直接返回二维码数据，失败返回二维码错误
*/
var get_school_check = function(checkin, msg) {
    return co(function * () {
        var article = checkin
            ? config.forms.school_check_in
            : config.forms.school_check_out
        /*
        1.通过openid判断是老师还是家长
        2.如果是老师，准备一个措辞标题和内容
        3.如果是家长并且只有一个小孩，准备一个措辞标题和内容，如果是多余一个小孩，文字内容需要另外准备
        */

        let teachers_res = yield i_teachers.exist(msg.FromUserName);
        //是教师
        if (res_have_result(teachers_res)) {
            var teacher = teachers_res.result[0];
            var n = {}
            Object.assign(n, article)
            n.title = checkin
                ? "小朋友上学了"
                : "小朋友放学了";
            n.description = teacher.name + "老师，请确认下是哪个小朋友" + (checkin
                ? "到学校了"
                : "离开学校了");
            return n;
        }
        //为家长签退签到 配置新模板 模板中的url指向查询页面
        var article = config.forms.parent_check
        let parent_res = yield i_parent.exist(msg.FromUserName);
        if (!res_have_result(parent_res)) {
            return Promise.reject(new Error("没有符合条件的家长和老师"));
        }
        var parent = parent_res.result[0];

        //通过家长确定孩子数据 TODO:此处只是考虑一个家长只有一个孩子的情况
        let child_res = yield i_children.exist_active(parent.childid1);
        if (!res_have_result(child_res)) {
            return Promise.reject(new Error("指定的小朋友数据不存在"));
        }
        let school_res = yield i_school.exist(child_res.result[0].schoolid);

        let check_data = {
            childid: child_res.result[0].childid,
            childname: child_res.result[0].name,
            checkname: parent.name,
            schoolid: child_res.result[0].schoolid,
            checktime: (new Date()),
            type: checkin
                ? 1
                : 0,
            sendinfo: 0
        };

        check_data.checkid = getHash(JSON.stringify(check_data));
        var n = {}
        Object.assign(n, article)

        n.title = child_res.result[0].name + (checkin
            ? "小朋友上学了"
            : "小朋友放学了");
        const date_begin_end = get_date_begin_end(new Date())
        const r = yield i_check.select_child_with_type(check_data.childid, check_data.type, date_begin_end.begin, date_begin_end.end);

        //家长签到的，家长自身的模板消息不用发，其他关联家长要发送
        yield send_template_parent_child(check_data, child_res.result[0], parent);

        if (res_have_result(r)) {
            check_data.checkid = r.result[0].checkid;
            yield i_check.update(check_data);

            n.description = parent.name + "家长，" + (checkin
                ? "您已经成功签到,请勿重复重新签到"
                : "您已经成功签退,请勿重复重新签退");
        } else {

            yield i_check.add(check_data);

            n.description = parent.name + "家长，" + child_res.result[0].name + "小朋友" + (checkin
                ? "到学校了"
                : "离开学校了");

            //添加学生签到区块链任务
            let task = bc.build_check_task(checkin
                ? 'checkin'
                : 'checkout', school_res.result[0], child_res.result[0], 0.01, n.description, parent);
            yield i_blockchains.add(task);
        }
        return n;
    }).catch(function(err) {
        console.error("处理学校签到错误:" + JSON.stringify(err));
        return Promise.reject(err);
    });
}

//学生签到数据检查
var child_check_data = function(childid, key, openid) {
    return co(function * () {
        let child_res = yield i_children.exist_active(childid);
        if (!res_have_result(child_res)) {
            console.error("childid:" + chilid + " 没有入学");
            return "";
        }
        let teacher_res = yield i_teachers.exist(openid);
        if (!res_have_result(teacher_res)) {
            console.error("openid:" + openid + " 扫码的用户不是老师");
            return "";
        }

        if (teacher_res.result[0].schoolid !== child_res.result[0].schoolid) {
            console.error("老师:" + teacher_res.result[0].name + "和学生:" + child_res.result[0].name + "不在同一个学校");
            return "";
        }

        let school_res = yield i_school.exist(child_res.result[0].schoolid);

        let check_data = {
            childid: childid,
            childname: child_res.result[0].name,
            checkname: teacher_res.result[0].name,
            schoolid: child_res.result[0].schoolid,
            checktime: (new Date()),
            sendinfo: 0 //此处表示模板消息是否发送了
        };
        if (parseInt(key) == qr_type.student_check_in) {
            check_data.type = 0;
        } else if (parseInt(key) == qr_type.student_check_out) {
            check_data.type = 1;
        }
        check_data.checkid = getHash(JSON.stringify(check_data));

        yield i_check.add(check_data);
        yield send_template_child(check_data, child_res.result[0], teacher_res.result[0]);

        //添加学生签到区块链任务
        let task = bc.build_check_task(check_data.type == 0
            ? 'checkin'
            : 'checkout', school_res.result[0], child_res.result[0], 0.01, child_res.result[0].name + "小朋友已经" + (check_data.type == 0
            ? "到校"
            : "离校"), teacher_res.result[0]);
        yield i_blockchains.add(task);

        return check_data;
    });
}

/**
根据二维码扫码获得的类型返回对应的画面描述
@param {String} type 二维码类型，注意此处都变成了字符型变量
@return {Object} promise对象，成功直接返回二维码数据，失败返回二维码错误
*/
var wx_ht_form = function(key, msg) {
    return co(function * () {
        let data = null;
        let childid = null;
        let i = key.indexOf(':');
        if (i !== -1) {
            childid = key.substr(i + 1);
            key = key.substr(0, i);
            let check_data = yield child_check_data(childid, key, msg.FromUserName);
            if (is_empty(check_data)) {
                return "";
            }
            return check_data.type
                ? [get_form(config.forms.student_check_out)]
                : [get_form(config.forms.student_check_in)];
        }

        switch (key) {
            case '' + qr_type.admin_register:
                data = config.forms.admin_register;
                break;
            case '' + qr_type.teacher_register:
                data = config.forms.teacher_register;
                break;
            case '' + qr_type.parent_register:
                data = config.forms.parent_register;
                break;
            case '' + qr_type.teacher_verification:
                data = config.forms.teacher_verification;
                break;
            case '' + qr_type.parent_verification:
                data = config.forms.parent_verification;
                break;
            case '' + qr_type.school_check_in:
                data = yield get_school_check(true, msg);
                break;
            case '' + qr_type.school_check_out:
                data = yield get_school_check(false, msg);
                break;
            default:
                //没有匹配上就返回家长报名
                data = config.forms.parent_register;
                break;
        }

        return [get_form(data)];
    }).catch(function(err) {
        return Promise.resolve([get_form(config.forms.parent_register)]);
    });
}

/**
创建学校签到永久二维码
@param {String} openid 用户openid
@param {int} type 创建类型
@return {Object} 二维码链接
*/
var get_school_check_qrcode = function(openid, type) {
    //首先检查是否是学校管理员，然后再查询数据库返回二维码信息，如果没有则转入到创建二维码再保存
    return co(function * () {
        //确定管理员
        let school_admin_res = yield i_school_admin.exist(openid);
        if (!res_have_result(school_admin_res)) {
            yield Promise.reject(new Error("学校管理员不存在:" + openid));
        }
        let schoolid = school_admin_res.result[0].schoolid;

        //检查是否存在已经保存的二维码
        let qr_res = yield i_qr.exist(schoolid, type + '', type);
        if (res_have_result(qr_res)) {
            //console.log("数据库中有这个二维码，直接返回");
            return {ticket: qr_res.result[0].ticket, url: qr_res.result[0].url};
        }

        if (qr_res.result_code == 0) {
            yield Promise.reject(new Error("查询QR记录出错:" + schoolid));
        }
        //需要创建
        //console.log("数据库中没有这个二维码，需要创建");
        let qr_create = yield wx_create_limit(type);
        if (is_empty(qr_create)) {
            yield Promise.reject(new Error("创建QR记录出错"));
        }

        var obj = {};
        obj.schoolid = schoolid;
        obj.type = type;
        obj.qr_key = type + '';
        obj.ticket = qr_create.ticket;
        obj.url = qr_create.url;
        i_qr.add(obj);

        return qr_create;

    }).catch(function(err) {
        //console.error(JSON.stringify(err));
        return Promise.reject(err);
    });
};

/**
创建学生签到永久二维码
@param openid 用户openid
@param type 创建类型
@param child 孩子编码
@return 二维码链接
*/
var get_child_check_qrcode = function(openid, type, childid) {
    //首先检查是否是学校管理员并且孩子的ID是存在的，然后再查询数据库返回二维码信息，如果没有则转入到创建二维码再保存
    return co(function * () {
        //确定管理员
        let school_admin_res = yield i_school_admin.exist(openid);
        if (!res_have_result(school_admin_res)) {
            yield Promise.reject(new Error("学校管理员不存在:" + openid));
        }
        let schoolid = school_admin_res.result[0].schoolid;

        //确定孩子
        let child_res = yield i_children.in_school(schoolid, childid);
        if (!res_have_result(child_res)) {
            yield Promise.reject(new Error("学校没有这个学生:" + childid));
        }

        //检查是否存在已经保存的二维码
        let qr_res = yield i_qr.exist(schoolid, childid, type);
        if (res_have_result(qr_res)) {
            //console.log("数据库中有这个二维码，直接返回");
            return {ticket: qr_res.result[0].ticket, url: qr_res.result[0].url};
        }

        if (qr_res.result_code == 0) {
            yield Promise.reject(new Error("查询QR记录出错:" + schoolid));
        }
        //需要创建:学生二维码是类型+学生ID
        let qr_create = yield wx_create_limit(type + ":" + childid);
        if (is_empty(qr_create)) {
            yield Promise.reject(new Error("创建QR记录出错"));
        }

        var obj = {};
        obj.schoolid = schoolid;
        obj.type = type;
        obj.qr_key = childid;
        obj.ticket = qr_create.ticket;
        obj.url = qr_create.url;
        i_qr.add(obj);

        return qr_create;

    }).catch(function(err) {
        //console.error(JSON.stringify(err));
        return Promise.reject(err);
    });
};

var get_form = function(source) {
    var target = Object.assign({}, source);
    target.url = get_redirect_menu(target.url, config.wx.appid)
    return target;
}

module.exports = {
    wx_create_tmp,
    wx_create_limit,
    wx_ht_form,
    qr_type,
    get_school_check_qrcode,
    get_child_check_qrcode,
    wx_send_check_template
};
