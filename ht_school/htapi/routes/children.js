var express = require('express');
var htapi_code = require('../common/htapi_code');
var {
    res_is_success,
    getHash,
    get_userinfo,
    getBirthday
} = require('../common/database/tool');
var i_children = require('../common/database/interface/i_children');
var router = express.Router();

/*
学生管理接口
*/
router.get('/', function(req, res, next) {
    res.send(htapi_code(true));
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
