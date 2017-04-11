/**
签到相关接口
*/

var express = require('express');
var htapi_code = require('../common/htapi_code');
const {
    qr_type,
    wx_send_check_template,
} = require('../common/wx/wx_qrcode_reply');

var i_parent = require('../common/database/interface/i_parent');
var i_children = require('../common/database/interface/i_children');
var i_school_admin = require('../common/database/interface/i_school_admin');
var i_school = require('../common/database/interface/i_school');
var i_teachers = require('../common/database/interface/i_teachers');
var i_check = require('../common/database/interface/i_check');
const i_blockchains = require('../common/database/interface/i_blockchains');
const bc = require('../common/blockchains');

const co = require('co');
const {
    res_is_success,
    getHash,
    is_empty,
    get_userinfo,
    check_userinfo,
    res_have_result,
    get_date_begin_end,
    format_date,
    check_time
} = require('../common/database/tool')

var router = express.Router();

/*
本接口用于教师为学生签到
*/
router.post('/', function(req, res, next) {

    return co(function*() {
        //检查session
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        let teacher_res = yield i_teachers.exist(userinfo.openid);
        if (!res_have_result(teacher_res)) {
            console.error("openid:" + userinfo.openid + " 不是教师，不能为学生签到");
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        let child_res = yield i_children.exist_active(req.body.childid);
        if (!res_have_result(child_res)) {
            console.error("childid:" + req.body.childid + " 不是在校学生");
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        if (teacher_res.result[0].schoolid !== child_res.result[0].schoolid) {
            console.error("老师和学生不是同一个学校 教师:" + JSON.stringify(teacher_res.result[0]) + " 学生:" + JSON.stringify(child_res.result[0]));
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }

        let school_res = yield i_school.exist(child_res.result[0].schoolid);
        if (!res_have_result(school_res)) {
            console.error("schoolid:" + child_res.result[0].schoolid + " 没有这个教学点");
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        let check_data = {
            childid: child_res.result[0].childid,
            childname: child_res.result[0].name,
            checkname: teacher_res.result[0].name,
            schoolid: child_res.result[0].schoolid,
            checktime: (new Date()),
            type: req.body.type == '0' ?
                0 : 1,
            sendinfo: 0 //此处表示模板消息是否发送了
        };

        check_data.checkid = getHash(JSON.stringify(check_data));
        const date_begin_end = get_date_begin_end(new Date())
        //TODO:为什么要更新？
        const r = yield i_check.select_child_with_type(child_res.result[0].childid, req.body.type, date_begin_end.begin, date_begin_end.end);
        if (res_have_result(r)) {
            check_data.checkid = r.result[0].checkid;
            yield i_check.update(check_data);
        } else {
            yield i_check.add(check_data);
        }
        //添加学生签到区块链任务
        let task = bc.build_check_task(check_data.type == 0
            ? 'checkin'
            : 'checkout', school_res.result[0], child_res.result[0], 0.01, child_res.result[0].name + "小朋友已经" + (check_data.type == 0
            ? "到校"
            : "离校"), teacher_res.result[0]);
        yield i_blockchains.add(task);

        wx_send_check_template(check_data, child_res.result[0], teacher_res.result[0], null, school_res.result[0]);
        var response = htapi_code(true)
        response.checkid = check_data.checkid;
        response.datetime = check_time(check_data.checktime);
        response.operate = check_data.checkname;
        response.child = check_data.childname;
        res.send(response);
        return Promise.resolve(true);
    }).catch(function(err) {
        console.error("签到出错:" + JSON.stringify(err));
        res.send(htapi_code(false));
        return Promise.resolve(null);
    });
});

/*
获取学生签到签退记录
*/
router.get('/', function(req, res, next) {
    //检查session
    const userinfo = get_userinfo(req.session);
    if (!check_userinfo(userinfo)) {
        res.send(htapi_code(false));
        return;
    }

    let date = is_empty(req.query.date) ?
        format_date(new Date()) :
        req.query.date;
    return co(function*() {
        let schoolid = '';
        //判断是否是家长
        let parent_res = yield i_parent.exist(userinfo.openid);
        if (res_have_result(parent_res)) {
            let child_res = yield i_children.exist_active(parent_res.result[0].childid1);
            if (!res_have_result(child_res)) {
                console.error("childid:" + parent_res.result[0].childid1 + " 没有符合条件的学生");
                res.send(htapi_code(false));
                return;
            }

            let check_res = yield i_check.select_child(child_res.result[0].childid, date + " 00:00:00", date + " 23:59:59");
            if (!res_is_success(check_res)) {
                console.error("查询学生签到错误:" + parent_res.result[0].childid1);
                res.send(htapi_code(false));
                return;
            }

            res.send(check_res);
            return;
        }

        //是否是老师或者管理员
        let teacher_res = yield i_teachers.exist(userinfo.openid);
        let school_admin_res = yield i_school_admin.exist(userinfo.openid);
        if (res_have_result(teacher_res)) {
            schoolid = teacher_res.result[0].schoolid;
        }
        if (res_have_result(school_admin_res)) {
            schoolid = school_admin_res.result[0].schoolid;
        }
        if (is_empty(schoolid)) {
            console.error("openid:" + userinfo.openid + " 既不是老师也不是管理员");
            res.send(htapi_code(false));
            return;
        }

        let check_res = yield i_check.select_school(schoolid, date + " 00:00:00", date + " 23:59:59");
        if (!res_is_success(check_res)) {
            console.error("查询学校签到错误:" + parent_res.result[0].childid1);
            res.send(htapi_code(false));
            return;
        }
        res.send(check_res);
        return Promise.resolve(true);
    }).catch(function(err) {
        console.error("查询签到出错:" + JSON.stringify(err));
        res.send(htapi_code(false));
        return;
    });
});


/*
获取学校里所有没有签退/签到的学生的学生
*/
router.get('/children', function(req, res, next) {
    return co(function*() {
        const userinfo = get_userinfo(req.session);
        if (!check_userinfo(userinfo)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        //判断用户是否是教师
        const teacher_res = yield i_teachers.exist(userinfo.openid);
        if (!res_is_success(teacher_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        const schooldid = teacher_res.result[0].schoolid
        const type = req.query[0] == '0' ? 0 : 1
        //根据学校id查询所有被激活的学生
        const child_res = yield i_check.not_check_children(schooldid, type);
        if (!res_is_success(child_res)) {
            res.send(htapi_code(false));
            return Promise.resolve(null);
        }
        var dic = {}
        //数据加上 教师id、name 和学校id
        const d = {
            "teacherid": teacher_res.result[0].teacherid,
            "teacherName": teacher_res.result[0].name,
            "schoolid": teacher_res.result[0].schoolid
        }
        Object.assign(dic, d)
        Object.assign(dic, child_res)
        res.send(dic);
        return Promise.resolve(true);
    });
});

module.exports = router;
