/** @module 学生数据接口 */
'use strict';

const sql = require('../sql')
const co = require('co');
const {
    verify_openid,
    is_empty,
    res_have_result
} = require('../tool')
const {
    operate_db
} = require('../db_handle')
const school = require('./i_school')

/**
 * 增加学生信息
 * @param  {Object} child 学生对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.add(child);
 */
exports.add = function(child) {
    return co(function*() {
        if (is_empty(child) || is_empty(child.schoolid)) {
            console.error('学生的学校和老师数据不能为空');
            return Promise.resolve(null);
        }
        // 新建立的学生必须映射到相应的教学点，否则禁止建立这个管理员
        const school_res = yield school.exist(child.schoolid)
        //查不到教学点
        if (!res_have_result(school_res)) {
            console.error('教学点不存在');
            return Promise.resolve(null);;
        }
        return operate_db(sql.children.add, [child])
    });
}

/**
 * 生表中学生信息是否有存在 存在则返回学生信息，不存在则无学生信息
 * @param  {String} childid 学生id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.exist(child);
 */
exports.exist = function(childid) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.children.exist, [childid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 存在已经被激活的学生
 * @param  {String} childid 学生id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.exist_active(child);
 */
exports.exist_active = function(childid) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.children.exist_active, [childid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 查询学校所有孩子
 * @param  {String} schoolid 学校id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.all_in_school(child);
 */
exports.all_in_school = function(schoolid) {
    return co(function*() {
        if (!is_empty(schoolid)) {
            return operate_db(sql.children.all_in_school, [schoolid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 查询学校中某个孩子
 * @param {String} schoolid 学校id
 * @param {String} childid 孩子id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.in_school(schoolid, childid);
 */
exports.in_school = function(schoolid, childid) {
    return co(function*() {
        if (!is_empty(schoolid) && !is_empty(childid)) {
            return operate_db(sql.children.in_school, [schoolid, childid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 更新学生基本信息:姓名，生日，性别，图片
 * @param {Object} child 学生对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.update_basic(child);
 */
exports.update_basic = function(child) {
    return co(function*() {
        if (is_empty(child) || is_empty(child.childid)) {
            return Promise.resolve(null);
        }
        const school_res = yield school.exist(child.schoolid)
        //查不到教学点
        if (!res_have_result(school_res)) {
            console.error('教学点不存在');
            return Promise.resolve(null);
        }
        return operate_db(sql.children.update_basic, [child.name, child.birthday, child.picture, child.sex, child.childid])
    });
}

/**
 * 批准学生，激活(当缴费成功)
 * @param {String} childid 学生id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.active(childid);
 */
exports.active = function(childid) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.children.active, [childid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 禁止学生，激活(当缴费成功)
 * @param {String} childid 学生id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.deactive(childid);
 */
exports.deactive = function(childid) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.children.deactive, [childid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 删除小孩信息
 * @param {String} childid 学生id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const child_res = yield i_children.delete(childid);
 */
exports.delete = function(childid) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.children.delete, [childid])
        }
        return Promise.resolve(null);
    });
}
