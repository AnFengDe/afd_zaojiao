/** @module 学生缴费数据接口 */
'use strict';

const co = require('co');
const sql = require('../sql')
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
 * 增加收费信息
 * @param  {Object} charge_item 缴费记录对象
 * @return {Object}             如果参数有问题则返回 null
 * @example
 * const charge_res = yield i_charge_list.add(charge_item)
 */
exports.add = function(charge_item) {
    return co(function*() {
        if (is_empty(charge_item) || is_empty(charge_item.schoolid) || is_empty(charge_item.childid) || is_empty(charge_item.teacherid) || is_empty(charge_item.parentid)) {
            console.error('缴费记录的学校,老师,家长和学生数据不能为空');
            return Promise.resolve(null)
        }
        const school_res = yield school.exist(charge_item.schoolid)
        if (!res_have_result(school_res)) {
            return Promise.resolve(null)
        }
        return operate_db(sql.charge_list.add, charge_item)
    })

}

/**
 * 查询孩子饿缴费记录
 * @param  {String} childid 学生id
 * @return {Object}          如果返回null 说明参数有问题
 * @example
 * const charge_res = yield i_charge_list.child_charge_list(childid)
 */
exports.child_charge_list = function(childid) {
    return co(function*() {
        if (!is_empty(childid)) {
            return operate_db(sql.charge_list.select_child, [childid])
        }
        return Promise.resolve(null)
    })
}
