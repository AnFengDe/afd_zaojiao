/*
获取用户授权
*/

var express = require('express');
var OAuth = require('wechat-oauth');
var htapi_code = require('../common/htapi_code');
var {res_is_success, get_userinfo, res_have_result} = require('../common/database/tool');
var i_users = require('../common/database/interface/i_users');
var config = require('config');
var wxconfig = config.wx;

var client = new OAuth(wxconfig.appid, wxconfig.secret);

var router = express.Router();

var send_exist_userinfo = function(session, exist_user, res) {
    console.log("已有的用户信息:" + JSON.stringify(exist_user));
    session.userinfo = exist_user;
    res.send(exist_user);
};

var add_userinfo_by_auth = function(session, userinfo) {
    i_users.add(userinfo).then(function(users_res) {
        if (res_is_success(users_res)) {
            session.userinfo = result;
        }
        console.log("数据库操作结果:" + JSON.stringify(users_res));
    });
};

var get_userinfo_by_auth = function(session, openid, res) {
    client.getUser(openid, function(err, result) {
        if (err) {
            res.send(err);
            return;
        }

        result.subscribe = 1;
        result.subscribe_time = Date.now();
        result.privilege = result.privilege.toString();

        console.log("身份验证获得的用户信息(关注事件没有处理):" + JSON.stringify(result));
        res.send(result);

        add_userinfo_by_auth(session, result);
    });
};

router.get('/', function(req, res, next) {
    var code = req.query.code || 0;
    req.query.openid = req.query.openid || 0;
    //没有跳转的code则返回失败
    if (!code) {
        res.send(htapi_code(false));
        return;
    }
    var _session = req.session;

    console.log("获取到session:" + JSON.stringify(req.session));
    //不在生产环境并且有openid，在后台查询不到用户信息，返回失败
    if (process.env.NODE_ENV !== "production" && req.query.openid) {
        const openid = req.query.openid;
        const userinfo = get_userinfo(_session);
        if (userinfo != '' && openid == userinfo.openid) {
            console.log("非生产环境获取到session");
            res.send(userinfo);
            return;
        };

        //通过openid查询自己有无这个用户，有则查询出来用，无则后续添加这个用户
        i_users.exist(openid).then(function(exist_res) {
            if (!res_have_result(exist_res)) {
                res.send(htapi_code(false));
            } else {
                send_exist_userinfo(_session, exist_res.result[0], res);
            }
        });
    } else {
        client.getAccessToken(code, function(err, result) {
            if (err) {
                res.send(err);
                return;
            }

            //如果session有则刷新处理 不请求服务器
            const userinfo = get_userinfo(_session);
            if (userinfo != '' && result.data.openid == userinfo.openid) {
                res.send(userinfo);
                return;
            };

            console.log("去微信服务器获取token:" + JSON.stringify(result));
            var openid = result.data.openid;

            //通过openid查询自己有无这个用户，有则查询出来用，无则后续添加这个用户
            i_users.exist(openid).then(function(exist_res) {
                if (!res_have_result(exist_res)) {
                    get_userinfo_by_auth(_session, openid, res);
                } else {
                    send_exist_userinfo(_session, exist_res.result[0], res);
                }
            });
        });
    }
});

module.exports = router;
