var co = require('co');
const db_config = require('./db_config');
const {
    is_empty
} = require('./tool');
const mysql = require('promise-mysql');
var pool = mysql.createPool(db_config);

exports.operate_db = function operate_db(sql, params) {
    return co(function*() {

        if (is_empty(sql)) {
            yield Promise.reject(error_info({
                code: 'sql 语句为空',
                errno: 0
            }), 0);
        }

        let conn = yield pool.getConnection();
        let res = yield conn.query(sql, is_empty(params) ?
            null :
            params);
        pool.releaseConnection(conn);
        return result_json(res, 1);
    }).catch(function(err) {
        return result_json(error_info(err), 0);
    });
}

function result_json(res, code) {
    return {
        result: res,
        result_code: code
    };
}

function error_info(err) {
    return {
        code: err.code,
        errno: err.errno
    };
}

//事务写法 (例子)
function transaction() {
    connection.beginTransaction(function(err) {
        if (err) {
            throw err;
        }
        connection.query('INSERT INTO posts SET title=?', title, function(error, results, fields) {
            if (error) {
                return connection.rollback(function() {
                    throw error;
                });
            }

            var log = 'Post ' + result.insertId + ' added';

            connection.query('INSERT INTO log SET data=?', log, function(error, results, fields) {
                if (error) {
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                connection.commit(function(err) {
                    if (err) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                    console.log('success!');
                });
            });
        });
    });
}
