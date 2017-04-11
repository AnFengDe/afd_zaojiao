var express = require('express');
const co = require('co');
var htapi_code = require('../common/htapi_code');
var i_admin = require('../common/database/interface/i_school_admin');
var {
    res_is_success,
    getHash,
    get_userinfo,
    getBirthday,
} = require('../common/database/tool');
var router = express.Router();

/*
学校管理员接口
*/
router.get('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (userinfo.openid == '') {
            res.send(htapi_code(false));
            return;
        }
        const admin_res = i_admin.exist(userinfo.openid)
        if (!res_is_success(admin_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null)
        }
        res.send(admin_res.result);
        return Promise.resolve(true)
    });
});

router.post('/', function(req, res, next) {

    res.send(htapi_code(true));
});

router.delete('/', function(req, res, next) {

    res.send(htapi_code(true));
});

router.put('/', function(req, res, next) {

    res.send(htapi_code(true));
});

module.exports = router;
