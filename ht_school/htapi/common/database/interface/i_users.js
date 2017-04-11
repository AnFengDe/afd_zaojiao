/** @module 用户表数据接口 */
'use strict';

const sql = require('../sql')
const {
    verify_openid
} = require('../tool')
const co = require('co');
const {
    operate_db
} = require('../db_handle')

/**
 * 增加用户，此处调用由微信的事件通知发起
 * @param {Object} user 用户对象，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const user_res = yield i_users.add(user);
 */
exports.add = function(user) {
    return operate_db(sql.users.add, user);
}

/**
 * 用户表中用户信息是否有存在 存在则返回用户信息，不存在则无用户信息
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const user_res = yield i_users.exist(openid);
 */
exports.exist = function(openid) {
    return co(function*() {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.users.exist, [openid]);
    });
}

/**
 * 户订阅状态更新,如果参数错误，回调送回null
 * @param {Boolean} state true/false,或者1代表真，0代表假，表示是否订阅
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const user_res = yield i_users.subscribe(state, openid);
 */
exports.subscribe = function(state, openid) {
    return co(function*() {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(state ?
            sql.users.subscribe :
            sql.users.unsubscribe, openid);
    });
}
