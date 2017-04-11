/*
微信文字沟通回复
*/
'use strict';
const {get_article, is_empty} = require('../database/tool');
var {wx_ht_form, qr_type, get_school_check_qrcode} = require('./wx_qrcode_reply');
const co = require('co');

var wx_text_reply = function(msg) {
    return co(function * () {
        //检查语句中有无关键字，通过关键字回送内容
        if (/签到二维码/.test(msg.Content)) {
            let school_qr = yield get_school_check_qrcode(msg.FromUserName, qr_type.school_check_in);
            if (is_empty(school_qr)) {
                return get_article(msg.Content);
            } else {
                //console.log("得到学校签到二维码:" + JSON.stringify(school_qr) + '\n' + "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + school_qr.ticket);
                return "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + school_qr.ticket;
            }
        } else if (/签退二维码/.test(msg.Content)) {
            let school_qr = yield get_school_check_qrcode(msg.FromUserName, qr_type.school_check_out);
            if (is_empty(school_qr)) {
                return get_article(msg.Content);
            } else {
                console.log("得到学校签退二维码:" + JSON.stringify(school_qr) + '\n' + "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + school_qr.ticket);
                return "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + school_qr.ticket;
            }
        } else if (/教师申请/.test(msg.Content)) {
            return (yield wx_ht_form('' + qr_type.teacher_register, msg));
        } else if (/报名批准/.test(msg.Content)) {
            return (yield wx_ht_form('' + qr_type.parent_verification, msg));
        } else if (/报名/.test(msg.Content)) {
            return (yield wx_ht_form('' + qr_type.parent_register, msg));
        } else if (/教师批准/.test(msg.Content)) {
            return (yield wx_ht_form('' + qr_type.teacher_verification, msg));
        } else {
            return get_article(msg.Content);
        }
    });
};

module.exports = {
    wx_text_reply
};
