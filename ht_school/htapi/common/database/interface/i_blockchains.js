/** @module 区块链任务相关接口 */
'use strict';

const co = require('co');
const sql = require('../sql')
const {verify_openid, is_empty, res_have_result, encrypt, decrypt} = require('../tool')
const {operate_db} = require('../db_handle')
const school = require('./i_school')

/**
 * 增加一条区块链任务
 * @param  {Object} blockchains 任务对象
 * @return {Object}             如果参数有问题则返回 null
 * @example
 * const blockchians_res = yield i_blockchains_list.add(blockchains)
 */
exports.add = function(blockchains) {
    return co(function * () {
        if (is_empty(blockchains) || is_empty(blockchains.schoolid) || is_empty(blockchains.task)) {
            console.error('区块链任务和所属学校不能为空');
            return Promise.resolve(null)
        }
        blockchains.task = encrypt(blockchains.task);

        return operate_db(sql.blockchains.add, blockchains)
    })

}

/**
 * 查询区块链未执行任务记录
 * @param  {String} schoolid 学校id
 * @return {Object}          如果返回null 说明参数有问题
 * @example
 * const blockchains_res = yield i_blockchains.get_blockchains_task(schoolid)
 */
exports.get_blockchains_task = function(schoolid) {
    return co(function * () {
        if (is_empty(schoolid)) {
            return Promise.resolve(null)
        }

        let tasks = yield operate_db(sql.blockchains.select, [schoolid]);
        if (!tasks.result_code) {
            return Promise.resolve(tasks);
        }

        for (var i in tasks.result) {
            tasks.result[i].task = decrypt(tasks.result[i].task);
        }
        return Promise.resolve(tasks);
    })
}

/**
 * 删除任务记录
 * @param  {String} schoolid 学校id
 * @param  {String} timestamp 时间戳
 * @return {Object}          如果返回null 说明参数有问题
 * @example
 * const blockchains_res = yield i_blockchains.delete(schoolid,timestamp)
 */
exports.delete = function(schoolid, timestamp) {
    return co(function * () {
        if (is_empty(schoolid)) {
            return Promise.resolve(null)
        }

        return operate_db(sql.blockchains.delete, [schoolid, timestamp])
    })
}
