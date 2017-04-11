/**
数据通用共通
*/
const crypto = require('crypto');
var config = require('config');
var keywords = config.keywords;
var articles = config.articles;
var tags = config.tags;

/**
计算给定字符串的哈希，长度为32
如果不是字符串的话则自动转换
@param {String} text 需要哈sessionUserInfo希的字符
*/
exports.getHash = function(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

/**
 * penid验证
 * @param  {String} openid openid
 * @return {Bool}
 * TODO:对openid做检查,除了非空判断，以后会有长度和内容组成判断
 */
exports.verify_openid = function(openid) {
    return !exports.is_empty(openid);
};

/**
 * 检查对象或者变量是否为空
 * 如果变量是无内容字符串，null或者undefined，返回true,否则返回假
 * @param {Object} o 对象
 * @return {Bool}
 */
exports.is_empty = function(o) {
    return (typeof o == 'undefined' || o == null || o == '')
        ? true
        : false;
}

/**
 * 数字检查
 * @param {Object} n 对象
 * @return {Bool}
 */
exports.num_verify = function(n) {
    var re = new RegExp("^[0-9]*$");
    return re.test(n)
}

//只能输入1位的数字：
exports.num_count_verify = function(n) {
    var re = new RegExp("^\d{1}$");
    return re.test(n)
}

/*
根据消息内容回复文字内容或者图文消息
*/
exports.get_article = function(context) {
    const url = get_url(context);
    if (url == "") {
        return "您的反馈已收到,我们会定时回复.";
    }
    for (var url_key in articles) {
        if (url_key == url) {
            return [articles[url_key]];
        }
    }
}

function get_url(context) {
    for (var key in keywords) {
        if (context.indexOf(key) < 0) {
            continue;
        }
        var key_arr = keywords[key];
        return key_arr[index(key_arr)];
    }
    return "";
}

/**
 * @private 获取数组中随机下标
 * @param  {[]} 数组
 * @return {Int} 下标数
 */
function index(key_arr) {
    var randomNum = Math.random() * key_arr.length;
    return parseInt(randomNum, 10)
}

/**
 * @private  获取转换后的菜单
 */
var _encode_menu = function(menu, appid) {
    const filter1 = "mp.weixin.qq.com"; //消除特殊菜单
    const filter2 = "http://www.afdoa.com/"
    return (menu.indexOf(filter1) > 0 || menu == filter2)
        ? menu
        : exports.get_redirect_menu(encodeURIComponent(menu), appid);

}

exports.encode_menu = function(menus, appid) {
    var r = {}
    var a = []
    Object.assign(r, menus);
    for (d of r.button) {
        if (typeof d.url != 'undefined') {
            d.url = _encode_menu(d.url, appid)
        } else if (typeof d.sub_button != 'undefined') {
            d.sub_button = _encode_menu_list(d.sub_button, appid);
        }
        a.push(d)
    }

    r["button"] = a
    if (typeof menus.matchrule != 'undefined') {
        if (typeof menus.matchrule.group_id != 'undefined') {
            var group_id = menus.matchrule.group_id
            r["matchrule"] = {
                'group_id': tags[group_id]
            };
        }
    }
    return r
}

function _encode_menu_list(subArray, appid) {
    let a = []
    for (var obj in subArray) {
        var dic = {}
        Object.assign(dic, subArray[obj]);
        if (typeof subArray[obj].url != 'undefined') {
            dic.url = _encode_menu(subArray[obj].url, appid)
        }
        a.push(dic)
    }
    return a
}

exports.get_redirect_menu = function(encodeURL, appid) {
    const preffix = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri="
    const suffix = "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
    return preffix + encodeURL + suffix
}

/**
 * 获取userinfo
 * @param  {Object} session
 * @return {Object}
 */
exports.get_userinfo = function(session) {
    if (exports.is_empty(session) || exports.is_empty(session.userinfo)) {
        return "";
    } else {
        return session.userinfo;
    }
}

exports.months_of_age = function(date) {
    if (typeof date == 'undefined') {
        return
    }
    var n = new Date(date)
    var c = new Date()
    var diff = c.getTime() - n.getTime() //时间差的毫秒数
    return Math.floor(diff / (30 * 24 * 3600 * 1000))
}

/**
 * 获取生日
 */
exports.getBirthday = function(month) {
    if (month == null || month == '') {
        return
    }
    let milliseconds = new Date().getTime();
    let n = month * 30 * 24 * 60 * 60 * 1000
    let dif = milliseconds - n
    let t = new Date(dif);
    return exports.format_date(t)
}

/**
 * 格式化日期
 */
exports.format_date = function(t) {
    let year = t.getFullYear()
    let month = parseInt(t.getMonth() + 1);
    let day = parseInt(t.getDate());
    return year + "/" + time_space(month) + "/" + time_space(day);
}

/**
 * 接送时间格式化  年 月 小时:分钟
 */
exports.check_time = function(t) {
    let year = t.getFullYear()
    let month = parseInt(t.getMonth() + 1);
    let day = parseInt(t.getDate());
    let hour = parseInt(t.getHours());
    let min = parseInt(t.getMinutes());
    return year + "年" + time_space(month) + "月" + time_space(day) + " " + time_space(hour) + ":" + time_space(min)
}

/**
 * 获取
 * @param  {Date} t 指定日期
 * @return {Object} {begin , end }
 */
exports.get_date_begin_end = function(t) {
    let year = t.getFullYear()
    let month = parseInt(t.getMonth() + 1);
    let day = parseInt(t.getDate());
    return {
        begin: year + "/" + time_space(month) + "/" + time_space(day) + " 00:00:00",
        end: year + "/" + time_space(month) + "/" + time_space(day) + " 23:59:59"
    }
}

function time_space(t) {
    return t < 10
        ? '0' + t
        : t;
}

/**
 *判断返回的结果
 */
exports.res_is_success = function(res) {
    if (!exports.is_empty(res) && res.result_code == 1) {
        return true;
    }
    return false;
}

/**
 * 检查userinfo信息
 * @param  {Object} userinfo
 * @return {Bool}
 */
exports.check_userinfo = function(userinfo) {
    if (!exports.is_empty(userinfo) && !exports.is_empty(userinfo.openid)) {
        return true;
    }
    return false;
}

/**
 * 检查是否有结果
 * @param  {Object} res
 * @return {Bool}
 */
exports.res_have_result = function(res) {
    if (!exports.is_empty(res) && !exports.is_empty(res.result) && res.result_code == 1 && res.result.length > 0) {
        return true;
    }
    return false;
}

exports.crypto_test = function() {
    var txt = "123465";
    var salt = "abcdefghijklmnopqrstuvwxyz";
    crypto.pbkdf2(txt, salt, 4096, 256, function(err, hash) {
        if (err) {
            throw err;
        }
        console.log(hash.toString('hex'));
    })
}

exports.encrypt = function(text) {
    var encrypted = "";
    var cip = crypto.createCipher('rc4', "afdzaojiao");
    encrypted += cip.update(text, 'binary', 'hex');
    encrypted += cip.final('hex');

    return encrypted;
}

exports.decrypt = function(encrypted) {
    var decrypted = "";
    var decipher = crypto.createDecipher('rc4', "afdzaojiao");
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');
    return decrypted;
}
