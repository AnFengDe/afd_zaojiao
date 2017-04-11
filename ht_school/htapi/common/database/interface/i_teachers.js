/** @module 学校管理员表数据接口 */
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
const users = require('./i_users')

/**
 * 老师表中老师信息是否有存在 存在则返回老师信息，不存在则无老师信息
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const teacher_res = yield i_teacher.exist(openid);
 */
exports.exist = function(openid) {
    return co(function*() {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.teachers.exist, [openid]);
    });
}

/**
 * 查询某个学校的所有老师
 * @param {String} schoolid 学校ID
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const teacher_res = yield i_teacher.select(schoolid);
 */
exports.select = function(schoolid) {
    return co(function*() {
        if (is_empty(schoolid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.teachers.select, [schoolid]);
    });
}

/**
 * 批准老师，激活
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const teacher_res = yield i_teacher.active(openid);
 */
exports.active = function(openid) {
    return co(function*() {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.teachers.active, [openid]);
    });
}


/**
 * 禁止老师
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const teacher_res = yield i_teacher.deactive(openid);
 */
exports.deactive = function(openid) {
    return co(function*() {
        if (!verify_openid(openid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.teachers.deactive, [openid]);
    });
}

/**
 * 根据teacherid删除老师
 * @param {String} teacherid 用户teacherid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const teacher_res = yield i_teacher.delete(teacherid);
 */
exports.delete = function(teacherid) {
    return co(function*() {
        if (!verify_openid(teacherid)) {
            return Promise.resolve(null);
        }
        return operate_db(sql.teachers.delete, [teacherid]);
    });
}

/**
 * 增加老师
 * 老师的数据添加只能从申请画面上发起，管理员只能审批不能修改

 * 老师一定是关注过本微信号的用户，微信相关信息从数据库中查询合并后更新，提交的数据可以
 * 不包含除了openid之外的信息, 此处teachers可以缺少微信相关数据项目

 * @param {Object} teachers 老师对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const teacher_res = yield i_teacher.add(teachers);
 */
exports.add = function(teachers) {
    return co(function*() {
        if (is_empty(teachers) || !verify_openid(teachers.openid)) {
            console.error('openid为空');
            return Promise.resolve(null);
        }

        let school_res = yield school.exist(teachers.schoolid);
        if (!res_have_result(school_res)) {
            console.error('教学点不存在');
            return Promise.resolve(null);
        }

        let users_res = yield users.exist(teachers.openid);
        if (!res_have_result(users_res)) {
            console.error(teachers.name + '没有关注服务号');
            return Promise.resolve(null);
        }

        //由于教师申请是可以选择性别的  所以需要单独处理；
        users_res.result[0].sex = teachers.sex
        var new_data = Object.assign(teachers, users_res.result[0]);

        return operate_db(sql.teachers.add, teachers);
    });
}

/**
 * 修改老师 仅限于姓名，电话，教学点
 * @param {Object} teachers 老师对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const teacher_res = yield i_teacher.update(teachers);
 */
exports.update = function(teachers) {
    return co(function*() {
        if (is_empty(teachers) || !verify_openid(teachers.openid)) {
            console.error('openid为空');
            return Promise.resolve(null);
        }

        let school_res = yield school.exist(teachers.schoolid);
        if (!res_have_result(school_res)) {
            console.error('教学点不存在');
            return Promise.resolve(null);
        }

        return operate_db(sql.teachers.update, [teachers.name, teachers.mobile, teachers.schoolid, teachers.openid]);
    });
}
