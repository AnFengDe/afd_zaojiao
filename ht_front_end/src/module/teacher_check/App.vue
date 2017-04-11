<template>
<div id="app">
  <div class="title">
    <div class="h-right" @click="showTimePicker">选择日期</div>
    <div class="h-left" @click="inToday">今天</div>
    <div class="h-center"> {{date}} {{this.weekday | filteDate}} </div>
    <mt-datetime-picker ref="picker" v-model="weekday" type="date" @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
  <table width="100%;" class="table" cellpadding="0" cellspacing="0">
    <tr>
      <td width="10%" height="35" class="title-td">序号</td>
      <td width="18%" class="title-td">姓名</td>
      <td width="18%" class="title-td">送来时间</td>
      <td width="18%" class="title-td">送园人</td>
      <td width="20%" class="title-td">接走时间</td>
      <td width="20%" class="title-td">送走人</td>
    </tr>
    <tr bolder="1px" style="border:1px solid #d9d9d9;" v-for="table in check_info">
      <td width="8%" height="35">{{1}}</td>
      <td width="18%">{{table.child_name}}</td>
      <td width="20%">{{table.check_in_time | filterCheckTime}}</td>
      <td width="18%">{{table.check_in_name}}</td>
      <td width="20%">{{table.check_out_time| filterCheckTime}}</td>
      <td width="20%">{{table.check_out_name}}</td>
    </tr>
  </table>
</div>
</div>
</template>

<script>
import * as util from 'src/js/util'
import * as request from 'src/js/request'
export default {
  data() {
    return {
      weekday: new Date(),
      date: new Date(+new Date() + 8 * 3600 * 1000).toISOString().substring(0, 10),
      checklist: [{
        childid: '',
        checktime: '',
        checkname: '',
        childname: '',
        type: 0,
      }]
    }
  },
  created() {
    request.getCheckList(this)
  },
  filters: {
    filteDate(val) {
      return util.get_weekday(val)
    },
    filterCheckTime(val) {
      if (val == '-') {
        val = ""
      }
      return util.check_time(val)
    }
  },
  computed: {
    check_info() {
      var list = [];

      if (this.checklist.length <= 0) {
        return []
      }
      var check_in = this.checklist.filter(this.is_checkin);
      var check_out = this.checklist.filter(this.is_checkout);
      for (var i of check_in) {
        var d = this.info_model()
        d.check_in_name = i.checkname
        d.check_in_time = i.checktime
        d.child_name = i.childname
        d.childid = i.childid
        list.push(d)
      }
      for (var l of list) {
        for (var i of check_out) {
          if (l.childid == i.childid) {
            l.check_out_name = i.checkname
            l.check_out_time = i.checktime
            l.child_name = i.childname
          }
        }
      }
      return list
    }
  },
  methods: {
    inToday() {
      this.date = this.format_date(new Date())
      request.getCheckList(this)
    },
    info_model() {
      return {
        "childid": "",
        "type": 0,
        "child_name": "-",
        "check_in_time": "-",
        "check_in_name": "-",
        "check_out_time": "-",
        "check_out_name": "-",
      }
    },
    is_checkin(v) {
      return v.type == 1;
    },
    is_checkout(v) {
      return v.type == 0;
    },
    format_date(t) {
      this.weekday = new Date(t)
      return new Date(+t + 8 * 3600 * 1000).toISOString().substring(0, 10);
    },
    showTimePicker() {
      this.$refs.picker.open();
    },
    handleConfirm(s) {
      this.date = this.format_date(s)
      request.getCheckList(this)
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;
}

body {
  margin: 0;
}

.title {
  width: 100%;
  height: 40px;
  text-align: center;
  text-align: center;
}

.h-left {
  line-height: 28px;
  margin: 15px 0 14px 20px;
  color: #69c2b0;
  font-size: 15px;
  font-weight: bold;
  float: left;
}

.h-center {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-weight: bolder;
  color: #4f4f4f;
}

.h-right {
  width: 68px;
  height: 35px;
  line-height: 28px;
  background: #69c2b0;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  margin: 14px 20px 14px 0;
  float: right;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table {
  border: 0;
  border-collapse: collapse;
}

.title-td {
  background-color: #c1d389;
  color: #ffffff;
  font-size: 14px;
  font-weight: bolder;
}
</style>
