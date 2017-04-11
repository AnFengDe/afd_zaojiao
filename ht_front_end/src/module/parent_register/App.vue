<template>
<div id="app" style="width:100%,height:100%">
  <img style="width:100%;" src="./register.png" />
  <div style="margin-top:10px;margin-left:10px;text-align:start;font-size:16px;">
    {{note}}
  </div>
  <div class="div-border">
    <item_input_txt ref="ref_name" title="家长姓名：" :disabled=textDisable v-model="form.name" hint="家长姓名是必填项"></item_input_txt>
    <div style="height:15px;"></div>
    <item_input_tel ref="ref_tel" title="联系手机：" :disabled=textDisable v-model="form.mobile" placeholder="请输入11位手机号" hint="请输入正确的号码"></item_input_tel>
    <div style="height:15px;"></div>
    <item_input_sel ref="ref_schoolid" title="教学点：" style_label="position:relative;left:2px;letter-spacing: 5px;" :disabled=textDisable v-model="form.schoolid" :data_set=schools data_id="schoolid" data_text="name" data_default="e361add53da498f4bae11344827d6e94"></item_input_sel>
    <div style="height:15px;"></div>
    <item_input_txt ref="ref_child_name" title="宝宝姓名：" :disabled=textDisable v-model="form.child_name" hint="宝宝姓名是必填项"></item_input_txt>
    <div style="height:15px;"></div>
    <item_input_mon ref="ref_child_birthday" title="宝宝月龄：" :disabled=textDisable v-model="form.child_birthday" placeholder="输入宝宝有几个月大了" hint="请输入正确的月龄(15-42)"></item_input_mon>
    <div style="height:15px;"></div>
    <item_input_gen ref="ref_gen" title="性别：" :disabled=textDisable v-model="form.sex"></item_input_gen>
    <div style="height:15px;"></div>
  </div>
  <div class="div_register">
    <div class="button" :style="{display:d_display}" @click="submit" v-text="confirmText"></div>
  </div>
</div>
</template>


<script>
import * as request from 'src/js/request'
import * as tool from 'src/js/util'
export default {
  data() {
    return {
      d_display: 'block',
      textDisable: false,
      note: '',
      childNum: 0, //用于判断家长有几个小孩
      form: {
        registerid: '',
        childid: '',
        parentid: '',
        name: '',
        mobile: '',
        sex: 2,
        schoolid: 'e361add53da498f4bae11344827d6e94',
        active: 0,
        child_name: '',
        child_birthday: '',
      },
      schools: []
    }
  },
  created() {
    request.getRegister(this);
  },
  computed: {
    confirmText() {
      this.note = '';
      if (this.form.parentid != '') {
        this.d_display = "none";
        this.textDisable = true;
        if (this.form.active == 0) {
          this.note = '成功申请,请耐心等待管理员审核';
        } else {
          this.note = '您的审核已经通过了';
        }
      }
      return '提交申请';
    }
  },
  methods: {
    submit() {
      if (!this.$refs.ref_name.check() || !this.$refs.ref_tel.check() || !this.$refs.ref_child_name.check() || !this.$refs.ref_child_birthday.check()) {
        return;
      }
      request.register(this);
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
#app {
    @include app;
    .div-border {
        @include form_border;
    }

    .div_register {
        @include submit_button_div;
        margin-bottom: 10px;
    }

    .button {
        @include submit_button;
    }
}
</style>
