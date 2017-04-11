'use strict';

var htapi_code = function(flag) {
    return {
        code: (flag
            ? 200
            : -1),
        codeMsg: (flag
            ? "成功"
            : "系统繁忙")
    }
};

module.exports = htapi_code;
