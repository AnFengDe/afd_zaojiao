/**
二维码获取相关接口
*/

var express = require('express');
var htapi_code = require('../common/htapi_code');
const {
    qr_type,
    get_school_check_qrcode
} = require('../common/wx/wx_qrcode_reply');
var i_school_admin = require('../common/database/interface/i_school_admin');
const co = require('co');
const {
    verify_openid,
    is_empty,
    get_userinfo,
    check_userinfo
} = require('../common/database/tool')

var router = express.Router();

/**
生成二维码
* @param req.body.type
* 临时二维码：0:学校管理员申请 1:教师申请 2: 家长登记确认
* 永久二维码：100:学生二维码签到 101:学生二维码签退 102: 学校二维码签到 103:学校二维码签退
* 成功返回二维码图像文件的链接，否则返回空
*
/*
* 获取学校签到签退二维码
*/
router.post('/school/:check', function(req, res, next) {
    let type = req.params.check == 'checkin' ?
        qr_type.school_check_in :
        qr_type.school_check_out;

    //检查session
    const userinfo = get_userinfo(req.session);
    if (!check_userinfo(userinfo)) {
        res.send(htapi_code(false));
        return;
    }

    return co(function*() {
        let qrcode = yield get_school_check_qrcode(userinfo.openid, type);
        res.send(qrcode);
    }).catch(function(err) {
        console.error("创建二维码出错:" + JSON.stringify(err));
        res.send(htapi_code(false));
        return;
    });
});

/**
 * 获取学生签到签退二维码
 */
router.post('/child/:check', function(req, res, next) {
    let type = req.params.check == 'checkin' ?
        qr_type.student_check_in :
        qr_type.student_check_out;

    //检查session
    const userinfo = get_userinfo(req.session);
    if (!check_userinfo(userinfo)) {
        res.send(htapi_code(false));
        return;
    }

    return co(function*() {
        let qrcode = yield get_child_check_qrcode(userinfo.openid, type, req.body.childid);
        res.send(qrcode);
    }).catch(function(err) {
        console.error("创建二维码出错:" + JSON.stringify(err));
        res.send(htapi_code(false));
        return;
    });
});

module.exports = router;
