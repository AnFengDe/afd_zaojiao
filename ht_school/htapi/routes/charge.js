var express = require('express');
var htapi_code = require('../common/htapi_code');

var router = express.Router();

/*
缴费管理接口
*/
router.get('/', function(req, res, next) {

  res.send('');
});

router.post('/', function(req, res, next) {

  res.send(htapi_code(true));
});

//收费记录可以修改，禁止删除，删除目前需要手工维护
// router.delete('/', function(req, res, next) {
//
//   res.send(htapi_code(true));
// });

router.put('/', function(req, res, next) {

  res.send(htapi_code(true));
});

module.exports = router;
