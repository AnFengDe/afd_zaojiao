/**
预约登记API
*/

const co = require('co');
var express = require('express');
var htapi_code = require('../common/htapi_code');
var router = express.Router();
var i_register = require('../common/database/interface/i_register');
var i_teacher = require('../common/database/interface/i_teachers');
var i_admin = require('../common/database/interface/i_school_admin');
var i_parent = require('../common/database/interface/i_parent');
var i_children = require('../common/database/interface/i_children');
var bc = require('../common/blockchains');

var {
    check_userinfo,
    getBirthday,
    getHash,
    get_userinfo,
    res_is_success,
    months_of_age,
    res_have_result
} = require('../common/database/tool');
const config = require('config');
const tags = config.tags;

/*
正式注册
参数 openid, name, mobile, schoolid(固定)
*/
router.post('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //child
        var child_param = {
            'name': req.body.child_name,
            'schoolid': req.body.schoolid,
            'birthday': getBirthday(req.body.child_birthday),
            'sex': req.body.sex,
            'wallet':bc.create_wallet()
        }
        child_param['childid'] = getHash(JSON.stringify(child_param));
        //parent
        var parent_param = {
            'name': req.body.name,
            'mobile': req.body.mobile,
            'schoolid': req.body.schoolid,
            'sex': req.body.sex,
            'openid': userinfo.openid,
            'childid1': child_param['childid']
        }
        parent_param['parentid'] = getHash(JSON.stringify(parent_param));
        const children_res = yield i_children.add(child_param);
        if (!res_is_success(children_res)) {
            console.error("错误信息:" + JSON.stringify(children_res) + " 学生信息:" + JSON.stringify(child_param));
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const parent_res = yield i_parent.add(parent_param);
        if (!res_is_success(parent_res)) {
            console.error("错误信息:" + JSON.stringify(parent_res) + " 学生信息:" + JSON.stringify(parent_param));
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        if (req.body.registerid != '') {
            const register_res = yield i_register.delete_register(req.body.registerid);
        }
        //全部注册成功后 删除预约表中的信息
        response = htapi_code(true);
        response["parentid"] = parent_param['parentid'];
        response["childid"] = child_param['childid'];

        res.send(response);
        return Promise.resolve(true);
    });
});


/*
获取所有家长和关联的小孩的信息。
*/
router.get('/all', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        //验证openid对应的身份
        const admin_res = yield i_admin.exist(userinfo.openid);
        if (!res_have_result(admin_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const parent_res = yield i_parent.allInfo();
        if (!res_is_success(parent_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        res.send(parent_res.result);
        return Promise.resolve(true);
    });
});

/*
删除注册，这是老师或者管理员才有的功能
*/
router.delete('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        const param = req.query;
        const parent_res = yield i_parent.delete(param.parentid);
        if (!res_is_success(parent_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        //给用户移除家长分类tag
        wxapi.moveUserToGroup(param.openid, 100, function(err, data, res) {});
        const children_res = yield i_children.delete(param.childid)
        if (!res_is_success(children_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        res.send(htapi_code(true));
        return Promise.resolve(true);
    });
});

/*************free************/

/*
预约免费课程，填写用户信息
参数 openid, name, mobile, schoolid(固定)
数据插入到register预约表
*/
router.post('/free', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        req.body['openid'] = userinfo.openid;
        //除了上述参数，加上更新时间，数据插入或者更新到家长表中，如果不是激活家长则更新微信服务器中家长组别为意向家
        req.body['register_time'] = new Date();
        req.body['registerid'] = getHash(JSON.stringify(req.body));

        const register_res = yield i_register.register(req.body);
        var response = ""
        if (!res_is_success(register_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        response = htapi_code(true);
        response["registerid"] = req.body['registerid'];
        //给用户加上意向家长分类tag
        wxapi.moveUserToGroup(userinfo.openid, tags["意向家长"], function(err, data, res) {});
        res.send(response);
        return Promise.resolve(true);
    });
});

/*
查询自己的预约 返回查询数据
*/
router.get('/free', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const register_res = yield i_register.register_info(userinfo.openid);
        if (!res_is_success(register_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        res.send(register_res);
        return Promise.resolve(true);
    });
});

/*
查询自所有的用户预约信息
*/
router.get('/free/all', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //验证openid对应的身份
        const teacher_res = yield i_teacher.exist(userinfo.openid);
        if (res_is_success(teacher_res) && teacher_res.result.length == 1) {
            //如果存在 则需要再查询所有信息
            const register_res = yield i_register.all_register_info();
            //循环data 找到每个出生日期 然后转换
            const datas = register_res.result;
            if (datas.length == 0) {
                res.send(datas);
                return Promise.resolve(true);
            } else {
                var tmp = [];
                for (var o in datas) {
                    tmp[o] = datas[o];
                    tmp[o].child_birthday = months_of_age(tmp[o].child_birthday);
                }
                res.send(tmp);
                return Promise.resolve(true);
            }
        }

        res.send(htapi_code(false));
        return Promise.resolve(null);
    });
});

/*
删除预约，这是老师或者管理员才有的功能
*/
router.delete('/free', function(req, res, next) {
    return co(function*() {
      console.log(JSON.stringify(req.query));
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const teacher_res = yield i_teacher.exist(userinfo.openid);
        if (!res_is_success(teacher_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const register_res = yield i_register.delete_register(req.query.registerid);
        if (!res_is_success(register_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        res.send(register_res);
        return Promise.resolve(true);
    });
});

module.exports = router;
