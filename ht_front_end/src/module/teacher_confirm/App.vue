<template>
<div id="app">
  <div v-if="is_success">
    <div class="h-head">
      <div class="h-left">{{pickerValue}}</div>
      <div class="h-center"> {{this.weekday | filteDate}} </div>
      <div class="h-right">教师:{{form.teacherName}}</div>
    </div>
    <div style="padding:13px;">
      <table style="width:100%;">
        <tr v-for="i  in trNum()">
          <td v-if="index(i) <= children.length - 1 " class="td">
            <div class="child_td" :v-id="children[index(i)].childid" @click="selected($event)">
              {{children[index(i)].name}}
            </div>
          </td>
          <td class="blank"></td>
          <td v-if="index(i)+1 <= children.length - 1 " class="td">
            <div class="child_td" :v-id="children[index(i)+1].childid" @click="selected($event)">
              {{children[index(i)+1].name}}
            </div>
          </td>
          <td class="blank"></td>
          <td v-if="index(i)+2 <= children.length - 1 " class="td">
            <div class="child_td" :v-id="children[index(i)+2].childid" @click="selected($event)">
              {{children[index(i)+2].name}}
            </div>
          </td>
          <td v-else class="td"></td>
        </tr>
      </table>
      <div class="button" @click="check">确认送到</div>
    </div>
  </div>
  <item_check_result v-else success_title="成功签到" :child_name="this.result.child" :check_time="this.result.datetime" :operater="this.result.operate"></item_check_result>
</div>
</template>

<script>
import * as request from 'src/js/request'
import * as util from 'src/js/util'
export default {
  data() {
    return {
      type: '1', //0签退 1签到
      weekday: new Date(),
      pickerValue: new Date(+new Date() + 8 * 3600 * 1000).toISOString().substring(0, 10),
      oldDiv: null,
      id_selected: null,
      note: '',
      result: {
        checkid: '',
        child: '',
        operate: '',
        datetime: '',
      },
      form: {
        teacherid: '',
        teacherName: '',
        schoolid: ''
      },
      children: [{
        childid: '',
        name: '',
      }]
    }
  },
  created() {
    request.getChildrenInSchool(this)
  },
  filters: {
    filteDate(val) {
      return util.get_weekday(val)
    }
  },
  computed: {
    is_success() {
      if (this.result.checkid != '') {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    check() {
      if (this.id_selected != null) {
        const param = {
          type: this.type,
          childid: this.id_selected
        }
        request.teacherCheck(param, this)
      }
    },
    selected(i) {
      if (this.oldDiv != null) {
        this.oldDiv.style.backgroundColor = "#32a9b1";
      }
      var el = document.elementFromPoint(i.clientX, i.clientY)
      el.style.backgroundColor = "#04acea";
      this.oldDiv = el
      this.id_selected = el.getAttribute('v-id');
    },
    trNum() {
      if(typeof this.children == 'undefined'){
        return 0
      }
      return Math.ceil(this.children.length / 3)
    },
    index(i) {
      return 3 * (i - 1);
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
#app {
    @include app;
    .h-head {
        height: 60px;
        width: 100%;
        background-color: #f3f3f7;
        .h-left {
            line-height: 60px;
            padding-left: 10px;
            font-size: 15px;
            font-weight: bold;
            float: left;
        }

        .h-center {
            line-height: 60px;
            float: left;
            padding-left: 10px;
            font-size: 15px;
            font-weight: bolder;
        }

        .h-right {
            line-height: 60px;
            float: right;
            margin-right: 10px;
            color: #69c2b0;
            font-size: 15px;
            font-weight: bolder;
        }
    }
    .td {
        width: 80px;
        height: 53px;
    }
    .child_td {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background-color: #32a9b1;
        height: 43px;
        font-size: 16px;
        color: #fff;
    }
    .blank {
        width: 100px;
        height: 40px;
        text-align: center;
        background-color: #fff;
    }
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 40px;
        font-size: 16px;
        color: #ffffff;
        background-color: #ee6259;
        border-radius: 6px;
        margin: 40px auto;
    }
}
</style>
