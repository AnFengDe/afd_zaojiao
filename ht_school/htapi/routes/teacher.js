const co = require('co');
var express = require('express');
var htapi_code = require('../common/htapi_code');
var i_teacher = require('../common/database/interface/i_teachers');
var i_school_admin = require('../common/database/interface/i_school_admin');
var {
    res_have_result,
    res_is_success,
    getHash,
    get_userinfo,
    is_empty,
    check_userinfo
} = require('../common/database/tool');
const config = require('config');
const tags = config.tags;

var router = express.Router();

/*
教师管理接口
*/
router.get('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (userinfo.openid == '') {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        //验证openid对应的身份
        const teacher_res = yield i_teacher.exist(userinfo.openid)
        if (res_have_result(teacher_res)) {
            res.send(teacher_res.result);
            return Promise.resolve(true);
        }

        res.send(htapi_code(false));
        return Promise.resolve(null);
    });
});

//查询当前学校下所有教师数据(管理员专用)
router.get('/all', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (userinfo.openid == '') {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //根据openid 去管理员表中查询出基本信息
        const admin_res = yield i_school_admin.exist(userinfo.openid);
        if (!res_have_result(admin_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        const teacher_res = yield i_teacher.select(admin_res.result[0].schoolid);
        if (!res_have_result(teacher_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        res.send(teacher_res.result);
        return Promise.resolve(true);
    });
});

router.post('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        var param = {
            "sex": 0,
            "teacherid": "",
            "name": "",
            "mobile": "",
            "schoolid": "",
            "active": 0
        }
        req.body['teacherid'] = getHash(JSON.stringify(req.body));
        Object.assign(param, userinfo);
        Object.assign(param, req.body);
        const register_res = yield i_teacher.add(param);
        var response = ""
        if (!res_is_success(register_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        response = htapi_code(true);
        response["teacherid"] = req.body['teacherid'];
        res.send(response);
        return Promise.resolve(true);
    });
});

router.delete('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (userinfo.openid == '') {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //session中用户必须是管理员根据openid 去管理员表中查询出基本信息
        const admin_res = yield i_school_admin.exist(userinfo.openid)
        if (!res_have_result(admin_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        const teacher_res = yield i_teacher.delete(req.query.teacherid);
        if (!res_is_success(teacher_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //TODO:给用户移除教师分类tag 100不能写死
        wxapi.moveUserToGroup(req.query.openid, 100, function(err, data, res) {});
        res.send(htapi_code(true));
        return Promise.resolve(true);
    });
});

router.put('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (userinfo.openid == '') {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        // //session中用户必须是管理员根据openid 去管理员表中查询出基本信息
        const admin_res = yield i_school_admin.exist(userinfo.openid);
        if (!res_have_result(admin_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //如果active == 0 则修改为 1 反之亦然
        if (req.body.active == 0) {
            yield i_teacher.active(req.body.teacherid);
        } else {
            yield i_teacher.deactive(req.body.teacherid)
        }

        //给用户增加或者移除教师分类tag
        //如果是激活 req.body.active  接受的是 0
        wxapi.moveUserToGroup(req.body.openid, req.body.active ?
            tags["教师"] :
            tags["意向家长"],
            function(err, data, res) {});
        res.send(htapi_code(true));
        return Promise.resolve(true);
    });
});

module.exports = router;
