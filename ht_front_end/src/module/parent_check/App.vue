<template>
<div id="app">
  <div class="title">
    <div class="h-right" @click="showTimePicker">选择日期</div>
    <div class="h-left" @click="inToday">今天</div>
    <div class="h-center"> {{date}} {{this.weekday | filteDate}} </div>
    <mt-datetime-picker ref="picker" type="date" v-model="weekday" @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
  <div class="children-div">
    <div class="children-context">
      <span style="font-size:15px;">宝宝:{{check_info.child_name}}</span>
    </div>
    <table width="100%;" style="border:0;height:100px">
      <tr>
        <td width="50%">送园时间:{{check_info.check_in_time|filterCheckTime}}</td>
        <td>送园人:{{check_info.check_in_name}}</td>
      </tr>
      <tr>
        <td width="50%">接走时间:{{check_info.check_out_time|filterCheckTime}}</td>
        <td>接走人:{{check_info.check_out_name}}</td>
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
        checktime: '',
        checkname: '',
        childname: '',
        type: 0,
      }]
    }
  },
  computed: {
    check_info() {
      var d = {
        "child_name": "-",
        "check_in_time": "-",
        "check_in_name": "-",
        "check_out_time": "-",
        "check_out_name": "-",
      }
      if (this.checklist.length > 0) {
        for (var list of this.checklist) {
          if (list.type == 1) {
            d.check_in_name = list.checkname
            d.check_in_time = list.checktime
            d.child_name = list.childname
          } else {
            d.check_out_name = list.checkname
            d.check_out_time = list.checktime
            d.child_name = list.childname
          }
        }
      }
      return d;
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
        return val
      } else if (util.is_empty(val)) {
        return "-"
      }
      return util.check_time(val)
    }
  },
  methods: {
    inToday() {
      this.date = this.format_date(new Date())
      request.getCheckList(this)
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
    }
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
  background-color: #f3f3f7;
  width: 100%;
  height: 60px;
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

.children-div {
  margin-top: 30px;
  margin-left: 10px;
  margin-right: 10px;
  height: 135px;
  background-color: #f3f3f7;
}

.children-context {
  font-weight: bolder;
  height: 35px;
  background-color: #c1d389;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

td {
  line-height: 40px;
  font-size: 15px;
  color: #4f4f4f;
}
</style>
