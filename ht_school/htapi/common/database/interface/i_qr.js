/** @module 二维码数据接口 */
'use strict';

var co = require('co');
const sql = require('../sql')
const {verify_openid, is_empty, res_have_result} = require('../tool')
const {operate_db} = require('../db_handle')
const i_school = require('./i_school')

/**
 * 二维码信息是否有存在 存在则返回二维码信息，不存在则无
 * @param {String} schoolid 学校编码
 * @param {String} qr_key 二维码键值 如果是学校签到，和type一样的字符串
 * @param {int} type 二维码类型，签到还是签退，这个类型以后可以扩展
 * @example
 * const qr_res = yield i_qr.exist(qr);
 */
exports.exist = function(schoolid, qr_key, type) {
    return co(function * () {
        if (!is_empty(schoolid)) {
            return operate_db(sql.qr.exist, [schoolid, qr_key, type])
        }
        return Promise.resolve(null);
    });
}

/**
 * 增加二维码数据
 * @param {Object} qr 二维码对象
 * @return {Object}       如果参数有问题则返回 null
 * @example
 * const qr_res = yield i_qr.add(qr);
 */
exports.add = function(qr) {
    return co(function * () {
        if (is_empty(qr) || is_empty(qr.schoolid)) {
            return null;
        }
        let school_res = yield i_school.exist(qr.schoolid);
        if (!res_have_result(school_res)) {
            console.error("学校不存在:" + qr.schoolid);
            return null;
        }
        return operate_db(sql.qr.add, qr);
    });
}
