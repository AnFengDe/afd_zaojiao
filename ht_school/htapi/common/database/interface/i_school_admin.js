/** @module 学校管理员表数据接口 */
'use strict';

const co = require('co');
const sql = require('../sql')
const {verify_openid, is_empty, res_have_result} = require('../tool')
const {operate_db} = require('../db_handle')
const school = require('./i_school')

/**
 * 学校管理员表中学校管理员信息是否有存在 存在则返回学校管理员信息，不存在则无学校管理员信息
 * 学校管理员的数据添加只能从申请画面上发起，管理员只能审批不能修改
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const admin_res = yield i_school_admin.exist(openid);
 */
exports.exist = function(openid) {
    return co(function * () {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.school_admin.exist, [openid]);
    });
}

/**
 * 批准学校管理员，激活
 * 学校管理员的数据添加只能从申请画面上发起，管理员只能审批不能修改
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const admin_res = yield i_school_admin.active(openid);
 */
exports.active = function(openid) {
    return co(function * () {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.school_admin.active, [openid]);
    });
}

/**
 * 禁止学校管理员
 * 学校管理员的数据添加只能从申请画面上发起，管理员只能审批不能修改
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const admin_res = yield i_school_admin.deactive(openid);
 */
exports.deactive = function(openid) {
    return co(function * () {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.school_admin.deactive, [openid]);
    });
}

/**
 * 增加学校管理者
 * 学校管理员的数据添加只能从申请画面上发起，管理员只能审批不能修改
 * @param {Object} school_admin 学校管理员对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const admin_res = yield i_school_admin.add(school_admin);
 */
exports.add = function(school_admin) {
    return co(function * () {
        if (is_empty(school_admin) || !verify_openid(school_admin.openid)) {
            return Promise.resolve(null);
        }

        let school_res = yield school.exist(school_admin.schoolid);
        if (!res_have_result(school_res)) {
            return Promise.resolve(null);
        }

        return operate_db(sql.school_admin.add, school_admin);
    });
}

/**
 * 修改学校管理者 仅限于姓名，电话，和没有管理员的教学点
 * @param {Object} school_admin 学校管理员对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const admin_res = yield i_school_admin.update(school_admin);
 */
exports.update = function(school_admin) {
    return co(function * () {
        if (is_empty(school_admin) || !verify_openid(school_admin.openid)) {
            return Promise.resolve(null);
        }

        let school_res = yield school.exist(school_admin.schoolid);
        if (!res_have_result(school_res)) {
            return Promise.resolve(null);
        }

        return operate_db(sql.school_admin.update, [school_admin.name, school_admin.mobile, school_admin.schoolid, school_admin.openid]);
    });
}
