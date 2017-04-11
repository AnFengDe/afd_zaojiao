/** @module 教学点码表数据接口 */
'use strict';

const co = require('co');
const sql = require('../sql')
const {
    is_empty
} = require('../tool')
const {
    operate_db
} = require('../db_handle')

/**
 * 教学点码表中学校信息是否有存在 存在则返回学校信息，不存在则无学校信息
 * @param {String} schoolid 学校ID
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const school_res = yield i_school.exist(schoolid);
 */
exports.exist = function(schoolid) {
    return co(function*() {
        if (is_empty(schoolid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.school.exist, [schoolid]);
    });
}

/**
 * 删除指定schoolid的数据
 * @param {String} schoolid 学校ID
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const school_res = yield i_school.delete(schoolid);
 */
exports.delete = function(schoolid) {
    return co(function*() {
        if (is_empty(schoolid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.school.delete, [schoolid]);
    });
}

/**
 * 查询所有的教学点数据
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const school_res = yield i_school.all();
 */
exports.all = function() {
    return co(function*() {
        return operate_db(sql.school.all, null);
    });
}

/**
 * 新增学校信息
 * @param {Object} school 学校对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const school_res = yield i_school.add(school);
 */
exports.add = function(school) {
    return co(function*() {
        if (is_empty(school) || is_empty(school.schoolid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.school.add, school);
    });
}

/**
 * 更新教学点信息
 * @param {Object} school 学校对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const school_res = yield i_school.update(school);
 */
exports.update = function(school) {
    return co(function*() {
        if (is_empty(school) || is_empty(school.schoolid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.school.update, [school.name, school.address, school.leader, school.mobile, school.schoolid]);
    });
}
