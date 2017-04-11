/**
学校接口
*/
const co = require('co');
var express = require('express');
var htapi_code = require('../common/htapi_code');
var i_school = require('../common/database/interface/i_school');
var i_teacher = require('../common/database/interface/i_teachers');
var i_children = require('../common/database/interface/i_children');
var {
    res_is_success,
    check_userinfo,
    get_userinfo
} = require('../common/database/tool');
const {
    operate_db
} = require('../common/database/db_handle')
var router = express.Router();

/*
学校管理接口
*/
router.get('/', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        const school_res = yield i_school.all();
        if (!res_is_success(school_res)) {
            res.send([]);
            return Promise.resolve(null);
        }
        res.send(school_res.result);
        return Promise.resolve(true);
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
