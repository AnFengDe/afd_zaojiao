<template>
<div id="app" style="width:100%;height:100%">
  <img style="width:100%" src="./appointment_head.png" />
  <div style="margin-top:10px;margin-left:10px;text-align:start;font-size:16px;">
    {{note}}
  </div>
  <div class="div-border">
    <item_input_txt ref="ref_parent_name" title="家长姓名：" :disabled=textDisable v-model="form.parent_name" hint="请填写家长姓名"></item_input_txt>
    <item_input_tel ref="ref_parent_tel" title="联系手机：" :disabled=textDisable v-model="form.parent_mobile" placeholder="请输入11位手机号" hint="请输入正确的号码"></item_input_tel>
    <item_input_txt ref="ref_child_name" title="宝宝姓名：" :disabled=textDisable v-model="form.child_name" hint="请填写宝宝姓名"></item_input_txt>
    <item_input_mon ref="ref_child_birthday" title="宝宝月龄：" :disabled=textDisable v-model="form.child_birthday" placeholder="输入宝宝有几个月大了" hint="请输入正确的月龄(15-42)"></item_input_mon>
    <item_input_sel ref="ref_schoolid" title="教学点：" style_label="position:relative;left:2px;letter-spacing: 5px;" :disabled=textDisable v-model="form.schoolid" :data_set=schools data_id="schoolid" data_text="name" data_default="e361add53da498f4bae11344827d6e94"></item_input_sel>
  </div>
  <div class="div_register">
    <div class="button" :style="{display:div_display}" @click="submit" v-text="confirmText"></div>
  </div>
  <div style="margin-left:10px;text-align:start;margin-top:5px;font-size:12px;">
    预约适合一岁半至三岁半的宝宝家庭参与
  </div>
</div>
</template>

<script>
import * as request from 'src/js/request'
export default {
  data() {
    return {
      div_display: 'block',
      textDisable: false,
      note: '',
      form: {
        child_name: '',
        child_birthday: '',
        schoolid: 'e361add53da498f4bae11344827d6e94',
        parent_name: '',
        parent_mobile: '',
        openid: '',
        registerid: ''
      },
      schools: []
    }
  },
  computed: {
    confirmText() {
      if (!this.confirmType) {
        this.div_display = 'none'
        this.textDisable = true
        this.note = '我们已经收到你的免费预约申请，请静候佳音！'
      } else {
        return '现在预约'
      }
    },
    confirmType() {
      return this.form.registerid ? false : true
    }
  },
  created() {
    request.getFreeRegister(this)
  },
  methods: {
    submit() {
      if (!this.$refs.ref_parent_name.check() || !this.$refs.ref_parent_tel.check() || !this.$refs.ref_child_birthday.check()) {
        return;
      }
      if (this.confirmType) {
        const d = this.form.child_birthday
        request.freeRegister(this)
        //将日期变为数字
        this.form.child_birthday = d
        this.div_display = 'none'
        this.textDisable = true
        this.note = '我们已经收到你的免费预约申请，请静候佳音！'
      }
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
#app {
    @include app;
    .div-border {
        @include form_border;
        @include line;
        height: 245px;
    }

    .div_register {
        @include submit_button_div;
    }

    .button {
        @include submit_button;
    }
}
</style>
