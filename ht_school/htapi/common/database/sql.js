'use strict';

/**--users 操作---**/
//从微信接口中添加用户
function add_user() {
    return "insert into ht.afd_users set ? "
}

function exist_user() {
    return "select * from ht.afd_users where openid = ? "
}

function subscribe() {
    return "update ht.afd_users SET subscribe = 1 where openid = ? "
}

function unsubscribe() {
    return "update ht.afd_users SET subscribe = 0 where openid = ? "
}

/**--school_admin表 操作---**/
function exist_school_admin() {
    return "select * from ht.afd_school_admin where openid = ? "
}

function add_school_admin() {
    return "insert into ht.afd_school_admin set  ? "
}

function update_school_admin() {
    return "update ht.afd_school_admin SET name = ?, mobile = ?, schoolid = ? where openid = ?  "
}

function active_school_admin() {
    return "update ht.afd_school_admin SET active = 1 where openid = ?  "
}

function deactive_school_admin() {
    return "update ht.afd_school_admin SET active = 0 where openid = ?  "
}

/**--teachers表 操作---**/
function exist_teachers() {
    return "select * from ht.afd_teachers where openid = ?"
}

function delete_teacher() {
    return "delete from ht.afd_teachers where teacherid = ?"
}

function select_teachers() {
    return "SELECT a.name , a.mobile, a.teacherid , a.active , a.openid ," + " CASE a.sex WHEN '1' THEN '男' else '女'  end as sex  , b.name AS school_name FROM ht.afd_teachers a " + "LEFT JOIN ht.afd_school b ON a.schoolid = b.schoolid WHERE a.schoolid = ? "
}

function add_teachers() {
    return "insert into ht.afd_teachers set  ? "
}

function update_teachers() {
    return "update ht.afd_teachers SET name = ?, mobile = ?, schoolid = ? where openid = ?  "
}

function active_teachers() {
    return "update ht.afd_teachers SET active = 1 where teacherid = ?  "
}

function deactive_teachers() {
    return "update ht.afd_teachers SET active = 0 where teacherid = ?  "
}

/**--afd_children表 操作---**/
function exist_child() {
    return "select * from ht.afd_children where childid = ? "
}

function exist_child_active() {
    return "select * from ht.afd_children where childid = ? and active = 1 "
}

function all_children_in_school() {
    return "select * from ht.afd_children where schoolid = ? and active = 1 "
}

function children_in_school() {
    return "select * from ht.afd_children where schoolid = ? and childid = ? "
}

function add_child() {
    return "insert into afd_children set  ? "
}

function update_child_basic() {
    return "update afd_children set name = ? , birthday = ? , picture = ? , sex = ? where childid = ? "
}

function active_child() {
    return "update afd_children set active = 1 where childid = ? "
}

function deactive_child() {
    return "update afd_children set active = 0 where childid = ? "
}

function delete_child() {
    return "delete from afd_children  where childid = ? "
}
/**--afd_parent表 操作---**/
function exist_parent() {
    return "select * from ht.afd_parent where openid = ?"
}

function add_parent() {
    return "insert into afd_parent set  ? "
}

function delete_parent() {
    return "delete from ht.afd_parent where parentid = ? "
}

function get_childid() {
    return "select childid1 from afd_parent where parentid = ? "
}

//跟新缴费状态
function active_parent() {
    return "update afd_parent set active = 1 where parentid = ? "
}

function deactive_parent() {
    return "update afd_parent set active = 0 where parentid = ? "
}

function select_parents() {
    return "SELECT a.openid,a.parentid,a. NAME AS parent_name,a.mobile, b.childid ,b. NAME AS child_name,b.sex,b.birthday," + "b.schoolid,c. NAME AS school_name,b.active FROM afd_parent a LEFT JOIN afd_children b ON a.childid1 = b.childid " + "LEFT JOIN afd_school c ON c.schoolid = b.schoolid"
}

//只考虑一个孩子
function select_parents_by_child() {
    return "SELECT * from afd_parent where childid1 = ? "
}

//查询这个家长有多少个小孩
function has_children() {
    return "SELECT a.openid,a.parentid,a. NAME AS parent_name,a.mobile, b.childid ,b. NAME AS child_name,b.sex,b.birthday," + "b.schoolid,c. NAME AS school_name,b.active FROM afd_parent a LEFT JOIN afd_children b ON a.childid1 = b.childid " + "LEFT JOIN afd_school c ON c.schoolid = b.schoolid WHERE  a.openid =  ? UNION " + "SELECT a.openid,a.parentid,a. NAME AS parent_name,a.mobile,b.childid ,b. NAME AS child_name,b.sex,b.birthday," + "b.schoolid,c. NAME AS school_name,b.active FROM afd_parent a LEFT JOIN afd_children b ON a.childid2 = b.childid " + "LEFT JOIN afd_school c ON c.schoolid = b.schoolid WHERE  a.openid =  ? UNION " + "SELECT a.openid,a.parentid,a. NAME AS parent_name,a.mobile,b.childid ,b. NAME AS child_name,b.sex,b.birthday," + "b.schoolid,c. NAME AS school_name,b.active FROM afd_parent a LEFT JOIN afd_children b ON a.childid3 = b.childid " + "LEFT JOIN afd_school c ON c.schoolid = b.schoolid WHERE  a.openid =  ? UNION " + "SELECT a.openid,a.parentid,a. NAME AS parent_name,a.mobile,b.childid ,b. NAME AS child_name,b.sex,b.birthday," + "b.schoolid,c. NAME AS school_name,b.active FROM afd_parent a LEFT JOIN afd_children b ON a.childid4 = b.childid " + "LEFT JOIN afd_school c ON c.schoolid = b.schoolid WHERE  a.openid =  ? UNION " + "SELECT a.openid,a.parentid,a. NAME AS parent_name,a.mobile,b.childid ,b. NAME AS child_name,b.sex,b.birthday," + "b.schoolid,c. NAME AS school_name,b.active FROM afd_parent a LEFT JOIN afd_children b ON a.childid5 = b.childid " + "LEFT JOIN afd_school c ON c.schoolid = b.schoolid WHERE  a.openid =  ? UNION " + "SELECT a.openid,a.parentid,a. NAME AS parent_name,a.mobile,b.childid ,b. NAME AS child_name,b.sex,b.birthday," + "b.schoolid,c. NAME AS school_name,b.active FROM afd_parent a LEFT JOIN afd_children b ON a.childid6 = b.childid " + "LEFT JOIN afd_school c ON c.schoolid = b.schoolid WHERE  a.openid =  ?  "
}

/**--afd_school表 操作---**/
function add_school() {
    return "insert into afd_school set  ? "
}

function delete_school() {
    return "delete from afd_school where schoolid =  ? "
}

function update_school() {
    return "update afd_school set name = ?, address = ?, leader = ?, mobile = ? where schoolid =  ? "
}

function select_all_school() {
    return "select * from ht.afd_school  "
}

function exist_school() {
    return "select * from afd_school where schoolid = ? "
}

/**--afd_charge_list表 操作---**/
function add_charge_item() {
    return "insert into afd_charge_list set  ? "
}

function select_child_list() {
    return "select * from afd_charge_list where childid = ? order by payment_time desc"
}

function select_school_list() {
    return "select * from afd_charge_list where schoolid = ? order by childid, payment_time desc"
}

/**--afd_check表 操作---**/
function add_check() {
    return "insert into afd_check set  ? "
}

function update_check() {
   return "update afd_check set checkname = ?, checktime = ? where checkid = ?  "
}

function select_child() {
    return "select * from afd_check where childid = ? and checktime > ? and checktime <= ? order by checktime desc "
}

function select_child_with_type() {
    return "select * from afd_check where childid = ? and type = ? and checktime > ? and checktime <= ? order by checktime desc "
}

function select_school() {
    return "select * from afd_check where schoolid = ? and checktime > ? and checktime <= ? order by checktime desc "
}

function not_check_children() {
    return "SELECT * FROM afd_children b WHERE b.active = 1 AND b.schoolid = ? " +
        "AND b.childid NOT IN ( SELECT a.childid FROM ht.afd_check a " +
        "WHERE a.schoolid = ? AND date_format(a.checktime, '%y-%m-%d')= date_format(now(), '%y-%m-%d') " +
        "AND type = ? )";
}

/**--afd_qr表 操作---**/
function exist_qr() {
    return "select * from afd_qr where schoolid = ? and qr_key = ? and type = ? ";
}

function add_qr() {
    return "insert into afd_qr set  ? "
}

/**--afd_blockchains表 操作---**/
function add_blockchains() {
  return "insert into afd_blockchains set  ? "
}

function select_blockchains() {
  return "select schoolid, timestamp, task from afd_blockchains where schoolid = ? order by timestamp "
}

function delete_blockchains() {
  return "delete from afd_blockchains where schoolid = ? and timestamp = ? "
}

/**--afd_register表 操作---**/
function register_info() {
    return "select * from afd_register where openid = ? "
}

function select_all() {
    return 'select a.child_name as child_name, a.child_birthday as child_birthday, a.parent_name as parent_name,' + 'a.parent_mobile as parent_mobile, a.registerid as registerid,a.openid as openid,b.name as name ' + 'from afd_register a left join afd_school b on a.schoolid = b.schoolid ORDER BY a.register_time DESC'
}

function register() {
    return "insert into afd_register set  ? "
}

function delete_register() {
    return "delete from afd_register where registerid = ? "
}

function update_register() {
    return "update afd_register set child_name = ?, child_birthday = ?, parent_name = ?, parent_mobile = ?, schoolid = ? where openid = ? "
}

//所有允许操作的SQL语句列表
module.exports = {
    users: {
        add: add_user(),
        exist: exist_user(),
        subscribe: subscribe(),
        unsubscribe: unsubscribe()
    },
    charge_list: {
        add: add_charge_item(),
        select_child: select_child_list(),
        select_school: select_school_list()
    },
    check: {
        add: add_check(),
        update_check:update_check(),
        select_child: select_child(),
        select_child_with_type: select_child_with_type(),
        select_school: select_school(),
        not_check_children: not_check_children()
    },
    school_admin: {
        add: add_school_admin(),
        exist: exist_school_admin(),
        update: update_school_admin(),
        active: active_school_admin(),
        deactive: deactive_school_admin()
    },
    teachers: {
        add: add_teachers(),
        select: select_teachers(),
        exist: exist_teachers(),
        update: update_teachers(),
        active: active_teachers(),
        deactive: deactive_teachers(),
        delete: delete_teacher()
    },
    children: {
        exist: exist_child(),
        exist_active: exist_child_active(),
        add: add_child(),
        update_basic: update_child_basic(),
        active: active_child(),
        all_in_school: all_children_in_school(),
        in_school: children_in_school(),
        deactive: deactive_child(),
        delete: delete_child()
    },
    parent: {
        get_childid: get_childid(),
        get_all: select_parents(),
        get_by_child: select_parents_by_child(),
        exist: exist_parent(),
        add: add_parent(),
        active: active_parent(),
        deactive: deactive_parent(),
        hasChildren: has_children(),
        delete: delete_parent()
    },
    school: {
        add: add_school(),
        delete: delete_school(),
        update: update_school(),
        all: select_all_school(),
        exist: exist_school()
    },
    qr: {
        exist: exist_qr(),
        add: add_qr()
    },
    blockchains: {
      add: add_blockchains(),
      select: select_blockchains(),
      delete: delete_blockchains()
    },
    register: {
        select_all: select_all(),
        select: register_info(),
        register: register(),
        delete: delete_register(),
        update: update_register()
    }
}
