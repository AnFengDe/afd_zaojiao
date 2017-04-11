var express = require('express');
const co = require('co');
var htapi_code = require('../common/htapi_code');
var i_parent = require('../common/database/interface/i_parent');
var i_children = require('../common/database/interface/i_children');
var i_blockchains = require('../common/database/interface/i_blockchains');
var i_school_admin = require('../common/database/interface/i_school_admin');
var {
    res_is_success,
    getHash,
    res_have_result,
    check_userinfo,
    get_userinfo,
    getBirthday,
    is_empty
} = require('../common/database/tool');
const config = require('config');
const tags = config.tags;

var router = express.Router();

/*
家长管理接口
*/
router.get('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const parent_res = yield i_parent.exist(userinfo.openid)
        if (!res_is_success(parent_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        res.send(parent_res.result);
        return Promise.resolve(true);
    });
});

//获取该家长下所有学生
router.get('/children', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const child_res = yield i_parent.hasChildren(userinfo.openid)
        if (!res_is_success(child_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        res.send(child_res.result);
        return Promise.resolve(true);
    });
});

router.put('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //session中用户必须是管理员根据openid 去管理员表中查询出基本信息
        const admin_res = yield i_school_admin.exist(userinfo.openid);
        if (!res_have_result(admin_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const param = req.body;
        const parent_res = yield i_parent.active(param.parentid)
        if (res_is_success(parent_res)) {
            //给用户家长分类tag
            wxapi.moveUserToGroup(param.openid, tags["家长"], function(err, data, res) {});
            const child_res = yield i_children.active(param.childid);

            //构建区块链任务,激活学生钱包并充值
            const child_data = yield i_children.exist(param.childid);
            const child = child_data.result[0];
            let task = build_register_task(child.schoolid, child.wallet, 25, child, userinfo);
            yield i_blockchains.add(task);

            res.send(child_res.result);
            return Promise.resolve(true);
        }
        res.send(htapi_code(false));
        return Promise.resolve(null);
    });
});

module.exports = router;
