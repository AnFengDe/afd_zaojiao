/** @module 签到数据接口 */
'use strict';

const sql = require('../sql')
const co = require('co');
const {
    verify_openid,
    is_empty
} = require('../tool')
const {
    operate_db
} = require('../db_handle')

/**
 * 增加签到签退信息
 * @param  {Object} check 签到数据
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const check_res = yield i_check.add(check);
 */
exports.add = function(check) {
    return co(function*() {
        if (is_empty(check) || is_empty(check.childid) || is_empty(check.checkid) || is_empty(check.schoolid)) {
            console.log('学生,学校,老师或者家长数据不能为空');
            return Promise.resolve(null)
        }
        return operate_db(sql.check.add, check)
    })
}

/**
 * 修改签到签退信息
 * @param  {Object} check 签到数据
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const check_res = yield i_check.update(check);
 */
exports.update = function(check) {
    return co(function*() {
        if (is_empty(check)) {
            return Promise.resolve(null)
        }
        return operate_db(sql.check.update_check, [check.checkname, check.checktime, check.checkid])
    })
}

/**
 * 根据时间查询孩子的签到信息
 * @param  {String} childid 学生ID
 * @param  {String} begin   起始时间
 * @param  {String} end     结束时间
 * @return {Object}         如果参数有问题则返回 null
 * @example
 * const check_res = yield i_check.select_child(childid, begin, end);
 */
exports.select_child = function(childid, begin, end) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.check.select_child, [
                childid, begin, end
            ])
        }
        return Promise.resolve(null)
    })
}

/**
 * 根据类型查询和时间查询孩子的签到信息
 * @param  {String} childid 学生ID
 * @param  {String} type    0签退 1签到
 * @param  {String} begin   起始时间
 * @param  {String} end    结束时间
 * @return {Object}        如果参数有问题则返回 null
 * @example
 * const check_res = yield i_check.select_child_with_type(hildid, type, begin, end);
 */
exports.select_child_with_type = function(childid, type, begin, end) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.check.select_child_with_type, [
                childid, type, begin, end
            ])
        }
        return Promise.resolve(null)
    })
}

/**
 * 查询学校孩子的签到信息
 * @param  {String} schoolid 学校id
 * @param  {String} begin   起始时间
 * @param  {String} end    结束时间
 * @return {Object}        如果参数有问题则返回 null
 * @example
 * const check_res = yield i_check.select_school(select_school, begin, end);
 */
exports.select_school = function(schoolid, begin, end) {
    return co(function*() {
        if (!is_empty(schoolid)) {
            return operate_db(sql.check.select_school, [
                schoolid, begin, end
            ])
        }
        return Promise.resolve(null)
    })
}

/**
 *
 当天 没有签到、签退学生
 * @param  {String} schoolid 学校id
 * @param  {String} type    0签退 1签到
 * @return {Object}        如果参数有问题则返回 null
 * @example
 * const check_res = yield i_check.not_check_children(select_school, begin, end);
 */
exports.not_check_children = function(schoolid, type) {
    return co(function*() {
        if (!is_empty(schoolid)) {
            return operate_db(sql.check.not_check_children, [
                schoolid, schoolid, type
            ])
        }
        return Promise.resolve(null)
    })
}
