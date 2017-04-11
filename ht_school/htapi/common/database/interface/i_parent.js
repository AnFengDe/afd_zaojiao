/** @module 家长表数据接口 */
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
const children = require('./i_children')

/**
 * 家长表中家长信息是否有存在 存在则返回家长信息，不存在则无家长信息
 * @param {String} openid 用户openid，符合微信定义格式
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.exist(openid);
 */
exports.exist = function(openid) {
    return co(function*() {
        if (verify_openid(openid)) {
            return operate_db(sql.parent.exist, [openid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 根据家长的openid 获取users表上的基本信息
 * @param {String} openid 家长openid
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.parent_basic_info(openid);
 */
exports.parent_basic_info = function(openid) {
    return co(function*() {
        if (verify_openid(openid)) {
            return operate_db(sql.parent.basic_info, [openid])
        }
        return Promise.resolve(null);
    });
}

//查询家长对应的小孩
/**
 * 根据家长的openid查出所有的小孩信息
 * @param {String} openid 家长openid
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.childrens(openid);
 */
exports.childrens = function(parentid) {
    return co(function*() {
        if (!is_empty(parentid)) {
            return operate_db(sql.parent.childrens, [parentid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 增加家长
 * 家长的数据添加只能从报名登记画面或者教师增加家长画面发起，缴费确认后才激活
 * 家长一定是关注过本微信号的用户，微信相关信息从数据库中查询合并后更新，提交的数据可以
 * 不包含除了openid之外的信息, 此处parent可以缺少微信相关数据项目
 * 增加的家长必须有学生信息关联
 * 一个学生可以有多个家长（最多4个)
 * @param {Object} parent 家长对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.add(openid);
 */
exports.add = function(parent) {
    return co(function*() {
        if (is_empty(parent) || !verify_openid(parent.openid) || is_empty(parent.childid1)) {
            console.error('家长信息,openid, 学生ID为空');
            return null;
        }

        // 新建立的家长必须映射到相应的教学点，否则禁止建立
        const school_res = yield school.exist(parent.schoolid);
        //查不到教学点
        if (!res_have_result(school_res)) {
            console.error('教学点不存在');
            return null;
        }

        //检查用户
        const users_res = yield users.exist(parent.openid);
        if (!res_have_result(users_res)) {
            console.log(parent.name + '没有关注服务号');
            return null;
        }

        var new_data = Object.assign(parent, users_res.result[0]);
        parent.active = 0;
        let parent_res = yield operate_db(sql.parent.add, parent);
        return parent_res;
    });
}

/**
 * 根据家长的openid查出所有的小孩信息
 * @param {String} openid 家长openid
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.hasChildren(openid);
 */
exports.hasChildren = function(openid) {
    return co(function*() {
        if (!is_empty(openid)) {
            let result = yield operate_db(sql.parent.hasChildren, [
                openid,
                openid,
                openid,
                openid,
                openid,
                openid
            ]);
            return result;
        }
        return Promise.resolve(null);
    });
}

exports.get_childid_array = function(parent) {
    var childids = [];
    if (!is_empty(parent.childid1)) {
        childids.push(parent.childid1);
    }
    if (!is_empty(parent.childid2)) {
        childids.push(parent.childid2);
    }
    if (!is_empty(parent.childid3)) {
        childids.push(parent.childid3);
    }
    if (!is_empty(parent.childid4)) {
        childids.push(parent.childid4);
    }
    if (!is_empty(parent.childid5)) {
        childids.push(parent.childid5);
    }
    if (!is_empty(parent.childid6)) {
        childids.push(parent.childid6);
    }

    return childids;
}

/**
 * 批准家长，激活(当缴费成功)
 * @param {String} parentid 家长id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.active(parentid);
 */
exports.active = function(parentid) {
    return co(function*() {
        if (!is_empty(parentid)) {
            return operate_db(sql.parent.active, [parentid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 禁止家长激活
 * @param {String} parentid 家长id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.deactive(parentid);
 */
exports.deactive = function(parentid) {
    return co(function*() {
        if (!is_empty(parentid)) {
            return operate_db(sql.parent.deactive, [parentid])
        }
        return Promise.resolve(null);
    });
}

/**
 * 查询家长所有孩子的详细信息
 * @param {Object} parent 家长对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.children(parent);
 */
exports.children = function(parent) {
    return co(function*() {
        if (is_empty(parent) || !verify_openid(parent.openid) || is_empty(parent.childid1)) {
            console.error('家长信息,openid, 学生ID为空');
            return Promise.resolve(null);
        }
        var childids = exports.get_childid_array(parent);
        var sql = 'select * from afd_children where childid in ' + JSON.stringify(childids).replace('[', '(').replace(']', ')');

        return operate_db(sql, null)
    });
}

/**
 * 删除家长信息
 * @param {String} parentid 家长parentid
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.delete(parentid);
 */
//TODO:传入 家长的parentid 和小孩的id  这个家长有多个小孩。。则删除小孩信息(后期开发)。
//FIXME:这个家长只绑定了一个小孩 则 家长和小孩信息都删除。
exports.delete = function(parentid) {
    return co(function*() {
        if (is_empty(parentid) || !verify_openid(parentid)) {
            console.log('家长openid,为空');
            return null;
        }
        //家长表中家长信息。
        return operate_db(sql.parent.delete, [parentid])
    });
}

/**
 * 查询所有家长和孩子
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.allInfo();
 */
exports.allInfo = function() {
    return operate_db(sql.parent.get_all, null);
}

/**
 * 根据childid获取家长信息
 * @param {String} childid 孩子id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.get_by_child(childid);
 */
exports.get_by_child = function(childid) {
    return operate_db(sql.parent.get_by_child, [childid]);
}

/**
 * 根据parentid获取 childid1
 * @param {String} parentid 家长id
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const parentid = yield i_children.get_childid(parentid);
 */
exports.get_childid = function(parentid) {
    return operate_db(sql.parent.get_childid, [parentid]);
}
