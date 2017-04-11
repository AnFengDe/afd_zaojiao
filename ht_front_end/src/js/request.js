'use strict'

import * as http from './http'

import {
  route
} from './config'
import {
  have_result,
  getParams,
  getBirthday,
  months_of_age,
  res_is_success,
  is_empty
} from './util'

/********************** 用户的预约部分 **********************/
//预约注册
export const freeRegister = (vm) => {
  const month = vm.form.child_birthday
  vm.form.child_birthday = getBirthday(month)
  http.post(route.register_free, vm.form).then((res) => {
    vm.form.child_birthday = month
    //提交成功后 将状态修改
    vm.form.registerid = res.data.registerid
  }, (err) => {})
}

//获取预约信息
export const getFreeRegister = (vm) => {
  userInfo().then((res) => {
    getSchool(vm);
    freeRegisterInfo().then((register_res) => {
      if (is_empty(register_res.data.result) || is_empty(register_res.data.result[0])) {
        return;
      }
      vm.form = register_res.data.result[0]
      if (vm.form.child_birthday == null || vm.form.child_birthday == '') {
        vm.form.child_birthday = 0
      } else {
        vm.form.child_birthday = months_of_age(register_res.data.result[0].child_birthday)
      }
    }, (err) => {
      console.log(err);
    })
  }, (err) => {
    console.log(err);
  })
}

//获取所有的预约信息
export const getFreeRegisters = (vm) => {
  userInfo().then((res) => {
    if (res_is_success(res)) {
      allFreeReigsterInfo().then((register_all) => {
        vm.freeRegisters = have_result(register_all) ?
          register_all.data : [];
      }, (err) => {
        console.log(err);
      })
    } else {
      vm.freeRegisters = []
    }
  }, (err) => {
    console.log(err);
  })
}

//删除预约信息
export const deleteFreeRegister = (registerid) => {
  return new Promise((resolve, reject) => {
    http.del(route.register_free, {
      registerid: registerid
    }).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

/********************** 用户的注册部分 **********************/
//注册
export const register = (vm) => {
  http.post(route.register, vm.form).then((res) => {
    if (res_is_success(res)) {
      vm.form.parentid = res.data.parentid
      vm.form.childid = res.data.childid;
    }
  }, (err) => {
    console.log(err);
  })
}

//获取用户的注册信息
export const getRegister = (vm) => {
  userInfo().then((res) => {
    getSchool(vm);
    //从register 表中查询到 是否有相关用户预约信息  如果有 则抽取出来
    freeRegisterInfo().then((register_res) => {
      const res = register_res.data;
      if (is_empty(res.result) || is_empty(res.result[0])) {
        //如果预约信息中没有相关数据 则需要从parent / child表中寻找
        vm.divDisplay = 'block'
        getParent().then((parent_res) => {
          if (have_result(parent_res)) {
            vm.form.parentid = parent_res.data[0].parentid
            getChildren().then((child_res) => {
              //处理结果
              const r = child_res.data[0];
              // vm.datalist = child_res.data
              vm.form.active = r.active
              vm.form.name = r.parent_name
              vm.form.mobile = r.mobile
              vm.form.schoolid = r.schoolid
              vm.form.child_name = r.child_name
              vm.form.sex = r.sex
              vm.form.child_birthday = months_of_age(r.birthday)
              vm.childNum = 1
            }, (err) => {
              console.log(err);
            });
          }
        }, (err) => {
          console.log(err);
        });
        return;
      }
      const r = res.result[0];
      vm.form.registerid = r.registerid
      vm.form.name = r.parent_name
      vm.form.mobile = r.parent_mobile
      vm.form.schoolid = r.schoolid
      vm.form.child_name = r.child_name
      vm.form.child_birthday = months_of_age(r.child_birthday)
      vm.childNum = 1
    }, (err) => {
      console.log(err);
    })
  }, (err) => {
    console.log(err);
  })
}

//获取所有用户的注册信息
export const getRegisters = (vm) => {
  userInfo().then((res) => {
    allReigsterInfo().then((reg_res) => {
      if (have_result(reg_res)) {
        vm.registers = reg_res.data
      }
    }, (err) => {
      console.log(err);
    })
  });
}

//删除注册信息
export const deleteRegister = (params) => {
  //FIXME:当前版本家长小孩 一对一。。如果是一个家长对多个小孩。。是不能删除家长信息。
  return new Promise((resolve, reject) => {
    http.del(route.register, params).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  });
}

/********************** 教师部分 **********************/

//获取所有教师列表
export const getTeachers = (vm) => {
  userInfo().then((res) => {
    res_is_success(res) ?
      allTeacherInfo(vm) :
      vm.teachers = [];
  }, (err) => {
    console.log(err);
  })
}

//获取教师信息
export const getTeacher = (vm) => {
  userInfo().then((res) => {
    getSchool(vm);
    if (res_is_success(res)) {
      teacherInfo().then((teacher_res) => {
        if (have_result(teacher_res)) {
          vm.form = teacher_res.data[0];
        }
      }, (err) => {
        console.log(err);
      });
    }
  }, (err) => {
    console.log(err);
  })
}

// 教师注册
export const teacherRegister = (vm) => {
  userInfo().then((res) => {
    if (res_is_success(res)) {
      http.post(route.teacher, vm.form).then((teacher_res) => {
        vm.form.teacherid = teacher_res.data.teacherid;
      }, (err) => {
        console.log(err)
      })
    }
  }, (err) => {
    console.log(err);
  })
}

//删除教师信息
export const deleteTeacher = (params) => {
  return new Promise((resolve, reject) => {
    http.del(route.teacher, params).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

//更新教师信息
export const updateTeacher = (params) => {
  return new Promise((resolve, reject) => {
    http.put(route.teacher, params).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}
/********************** 接送 **********************/
//获取签到签退的记录
export const getCheckList = (vm) => {
  userInfo().then(() => {
    http.get(route.check, {
      'date': vm.date
    }).then((check_res) => {
      vm.checklist = res_is_success(check_res) ? check_res.data.result : []
    }, (err) => {
      console.log(err)
    })
  });
}

//获取这个学校的小孩
export const getChildrenInSchool = (vm) => {
  userInfo().then((res) => {
    http.get(route.check_children, vm.type).then((children_res) => {
      vm.children = children_res.data.result;
      vm.form.teacherid = children_res.data.teacherid;
      vm.form.teacherName = children_res.data.teacherName;
      vm.form.schoolid = children_res.data.schoolid;
    }, (err) => {
      console.log(err)
    })
  });
}

//用于老师签到 签退
export const teacherCheck = (param, vm) => {
  userInfo().then((res) => {
    http.post(route.check, param).then((check_res) => {
      if (res_is_success(check_res)) {
        vm.result.checkid = check_res.data.checkid;
        vm.result.child = check_res.data.child;
        vm.result.datetime = check_res.data.datetime;
        vm.result.operate = check_res.data.operate;
      }
    }, (err) => {
      console.log(err)
    })
  });
}
/********************** 内部函数 **********************/

//获取用户信息
function userInfo() {
  //:如果用户第一次进入系统 必须先通过userinfo 查询到相关数据 存入到session中
  let code = getParams('?code')
  let openid = getParams('?openid') || 0
  let params = {}
  params.code = code
  if (openid) {
    params.openid = openid
  }
  return new Promise((resolve, reject) => {
    http.get(route.userinfo, params).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

//所有预约的信息
function allFreeReigsterInfo() {
  return new Promise((resolve, reject) => {
    http.get(route.register_free_all).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  });
}

//所有正式注册的信息
function allReigsterInfo() {
  return new Promise((resolve, reject) => {
    http.get(route.register_all).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  });
}

//获取预约信息
function freeRegisterInfo() {
  return new Promise((resolve, reject) => {
    http.get(route.register_free).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

//获取家长信息
function getParent() {
  return new Promise((resolve, reject) => {
    http.get(route.parent).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

//获取小孩信息
function getChildren() {
  return new Promise((resolve, reject) => {
    http.get(route.children_of_parent).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

//教师信息
function teacherInfo() {
  return new Promise((resolve, reject) => {
    http.get(route.teacher).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

//所有教师的信息
function allTeacherInfo(vm) {
  //获取对应的学校信息
  http.get(route.teacher_all).then((res) => {
    //分成两个数组 按照 active 来区分
    var actives = [];
    var inactives = [];
    if (have_result(res)) {
      vm.teachers = res.data;
    }
  }, (err) => {
    console.log(err);
  })
}

export const getSchool = (vm) => {
  http.get(route.school).then((res) => {
    vm.schools = res.data
  }, (err) => {
    console.log(err);
  })
}

//改变正式注册(家长和小孩)的active
export const updateActive = (params) => {
  //根据vm.childid  vm.parentid
  return new Promise((resolve, reject) => {
    http.put(route.parent, params).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  });
}

//------teacher part--------//
//根据学校id获取教师 TODO:用于级联 根据学校选择教师
// export const getTeachersWithId = (schoolid, vm) => {
//   http.get(route.teachers_with_schoolid, schoolid).then((res) => {
//     vm.teachers = res.data;
//     //将数据的第一项默认赋值给form
//     vm.form.teacherid = res.data[0].teacherid
//   }, (err) => {
//     console.log(err);
//   })
// }
