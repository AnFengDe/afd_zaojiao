<template>
<div id="app">
  <template v-for="info in registers">
    <template v-if="info.child_name == null||info.child_name == ''">
      <img :style="{width:divWidth,display:imgDisplay}" src="../../assets/no_record.png" />
</template>
    <template v-else>
<div :style="{display:formDisplay}" v-if="info.registerid != ''" class="children-div">
  <table height="45px" width="100%;" cellpadding="0" cellspacing="0" class="name">
    <tr>
      <item_td_text note="家长姓名:" />
      <item_td_text ref="ref_cparent_name" v-model="info.parent_name" />
      <item_td_text note="宝宝名称:" />
      <item_td_text ref="ref_child_name" v-model="info.child_name" />
    </tr>
    <tr>
      <item_td_text note="宝宝年龄:" />
      <td class="name-td">{{info.birthday | birthdayFilter}}个月</td>
      <item_td_text note="教学点:" style="letter-spacing: 4.4px;" />
      <item_td_text ref="ref_school_name" v-model="info.school_name" />
    </tr>
  </table>
  <div class="eie">
    <a v-bind:href="'tel:' + info.mobile" style="position: relative;top:-4px;color:#4f4f4f">联系手机 {{info.mobile}}</a>
    <button v-if='info.active != 1' class="eie-btn" @click="pass(info)">通过</button>
    <button v-if='info.active != 0' class="eie-btn" @click="show_qr(info)">二维码</button>
    <button class="eie-btn" @click="del(info)">删除</button>
  </div>
</div>
</template>
</div>
</template>

<script>
import * as request from 'src/js/request'
import * as tool from 'src/js/util'

export default {
  data() {
    return {
      divWidth: '100%',
      imgDisplay: 'block',
      formDisplay: 'none',
      registers: [{
        active: 0,
        parentid: '',
        childid: '',
        openid: '',
        parent_name: '',
        mobile: '',
        child_name: '',
        birthday: '',
        school_id: '',
        school_name: '',
        sex: '',
      }]
    }
  },
  created() {
    request.getRegisters(this);
  },
  watch: {
    registers(val, oldVal) {
      if (val.length > 0 && typeof val != 'undefined') {
        this.imgDisplay = 'none';
        this.formDisplay = 'block';
      } else {
        this.imgDisplay = 'block';
        this.formDisplay = 'none';
      }
    }
  },
  filters: {
    birthdayFilter(value) {
      const birthday = tool.months_of_age(value)
      return birthday
    }
  },
  methods: {
    del(data) {
      const params = {
        "parentid": data.parentid,
        "openid": data.openid,
        "childid": data.childid
      }
      request.deleteRegister(params).then((res) => {
        if (res.data.code != -1) {
          let index = this.registers.indexOf(data)
          this.registers.splice(index, 1)
        }
      }, (err) => {

      })
    },
    pass(data) {
      const params = {
        "parentid": data.parentid,
        "openid": data.openid,
        "childid": data.childid
      }
      request.updateActive(params).then((res) => {
        if (res.data.code != 1) {
          data.active = 1
        }
      }, (err) => {})
    },
    show_qr(data) {
      const params = {
        "schoolid": data.schoolid,
        "childid": data.childid
      }
      console.log("显示相应孩子签到和签退二维码");
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
#app {
    @include app;
    .name {
        padding: 6px 10px;
    }
    .children-div {
        @include label_border;

        .name-t {
            @include label_td_title;
        }

        .name-td {
            @include label_td_context;
        }

        .eie {
            @include label_bottom;
        }

        .eie-btn {
            @include label_button;
            width: 64px;
            margin-left: 4px;
            padding: 2px;
        }

        a {
            @include no_underline;
        }
    }
}
</style>
