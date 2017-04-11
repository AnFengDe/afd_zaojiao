/*
获取数据库连接配置
*/

var config = require('config');

var db_config = config.get('db');

module.exports = db_config;
