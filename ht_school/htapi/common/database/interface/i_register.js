/** @module 预约注册信息 */
'use strict';

const co = require('co');
const sql = require('../sql')
const {verify_openid, is_empty, res_have_result} = require('../tool')
const {operate_db} = require('../db_handle')

const i_school = require('./i_school')

/**
 * 查询用户的预约信息
 * @param {String} openid openid
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const register_res = yield i_register.register_info(openid);
 */
exports.register_info = function(openid) {
    return co(function * () {
        if (!is_empty(openid)) {
            return operate_db(sql.register.select, [openid]);
        } else {
            return Promise.resolve(null);
        }
    });
}

/**
 * 查询所有用户的预约信息（管理员）
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const register_res = yield i_register.all_register_info();
 */
exports.all_register_info = function() {
    return co(function * () {
        return operate_db(sql.register.select_all, null);
    });
}

/**
 * 用户预约
 * @param {Object} register_info 用户的预约信息，
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const register_res = yield i_register.register(register_info);
 */
exports.register = function(register_info) {
    return co(function * () {
        const school_res = yield i_school.exist(register_info.schoolid);
        if (!res_have_result(school_res)) {
            console.error('教学点不存在');
            return Promise.resolve(null);
        }

        var param = {};
        Object.assign(param, register_info)
        return operate_db(sql.register.register, param)
    });
}

/**
 * 删除一个用户的预约
 * @param {String} registerid 用户的预约id，
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const register_res = yield i_register.delete_register(registerid);
 */
exports.delete_register = function(registerid) {
    return co(function * () {
        return operate_db(sql.register.delete, registerid)
    });
}

/**
 * 修改一个用户的预约
 * @param {Object} register 用户的预约
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const register_res = yield i_register.update_register(register);
 */
exports.update_register = function(register) {
    return co(function * () {
        return operate_db(sql.register.update, [
            register.child_name,
            register.child_birthday,
            register.parent_name,
            register.parent_mobile,
            register.schoolid,
            register.openid
        ]);
    });
}
