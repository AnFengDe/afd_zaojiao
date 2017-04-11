const wurl = require('wurl')

export const getParams = (domain) => {
  var param = null;
  try {
    param = wurl(domain, window.location.href);
  } catch (e) {
    param = null;
  }
  return param;
}

/**
 * 获取生日月份
 */
export const getBirthday = (month) => {
  if (month == null || month == '') {
    return
  }
  let milliseconds = new Date().getTime();
  let n = month * 30 * 24 * 60 * 60 * 1000
  let dif = milliseconds - n
  let t = new Date(dif);
  return format_date(t)
}

/**
 * 根据日期转换月份
 */
export const months_of_age = (date) => {
  if (typeof date == 'undefined') {
    return
  }
  var n = new Date(date)
  var c = new Date()
  var diff = c.getTime() - n.getTime() //时间差的毫秒数
  return Math.floor(diff / (30 * 24 * 3600 * 1000))
}

/**
 * 接送时间格式化  小时:分钟
 */
export const check_time = (n) => {
    if(is_empty(n)){ return }
    var t = new Date(n)
    let hour = parseInt(t.getHours());
    let min = parseInt(t.getMinutes());
    return time_space(hour) + ":"+time_space(min)
}

/**
 * @private 格式化日期 yyyy/mm/dd
 */
function format_date(t) {
  let year = t.getFullYear()
  let month = parseInt(t.getMonth() + 1);
  let day = parseInt(t.getDate());
  return year + "/" + time_space(month) + "/" + time_space(day);
}

/**
 * @private 时间小于10 补0
 */
function time_space(t) {
  return t < 10
    ? '0' + t
    : t;
}

/**
 * 电话号码的验证
 */
export const telVerify = (mobile) => {
  var mobilevalid = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
  if (!mobilevalid.test(mobile)) {
    return false
  }
  return true
}

/**
 * 不为空验证
 */
export const notNullVerify = (param) => {
  if (param == '') {
    return false
  }
  return true
}

/**
 * 数字验证
 */
export const numVerify = (param) => {
  var numvalid = /^[0-9]*[1-9][0-9]*$/;
  if (!numvalid.test(param)) {
    return false
  }
  return true
}

/**
检查对象或者变量是否为空
*/
export const is_empty = function(o) {
  return (typeof o == 'undefined' || o == null || o == '')
    ? true
    : false;
}

/**
 *判断返回的结果
 */
export const res_is_success = (res) => {
  if (!is_empty(res) && res.data.code != -1) {
    return true;
  }
  return false;
}
/**
 *判断返回结果的数组
 */
export const have_result = (res) => {
  if (!is_empty(res) && res.data.length > 0) {
    return true;
  }
  return false;
}

/**
 *获取星期数
 */
export const get_weekday = (val) => {
  var weekday = new Array(7)
  weekday[0] = "周日"
  weekday[1] = "周一"
  weekday[2] = "周二"
  weekday[3] = "周三"
  weekday[4] = "周四"
  weekday[5] = "周五"
  weekday[6] = "周六"
  return weekday[val.getDay()]
}
