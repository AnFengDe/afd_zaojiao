<template>
<div style="width:100%;height:100%">
  <img style="width:100%;" src="../register.png" />
  <div style="margin-top:10px;margin-left:10px;text-align:start;font-size:16px;">
    {{this.noteText}}
  </div>
  <template v-for='info in datalist'>
    <template v-if="info.child_name == null||info.child_name == ''">
</template>
    <template v-else>
<div class="div-border">
  <table class="table" style="padding:12px" width="100%;" cellpadding="0" cellspacing="0">
    <tr>
      <td width="25%" class="name-t">家长姓名:</td>
      <td><input :style="{border:border_width,borderColor:parentNameBC,backgroundColor:parentNameBGC}" :disabled=textDisable :placeholder=namePlaceholder class="name-m" v-model="info.parent_name" /></td>
    </tr>
    <tr>
      <td colspan="2" style="height:15px;"></td>
    </tr>
    <tr>
      <td width="25%" class="name-t">联系手机:</td>
      <td><input :style="{border:border_width,borderColor:telBC,backgroundColor:telBGC}" :disabled=textDisable :placeholder=telPlaceholder class="name-m" v-model="info.mobile" /></td>
    </tr>
    <tr>
      <td colspan="2" style="height:15px;"></td>
    </tr>
    <tr>
      <td width="25%" class="name-t" style="letter-spacing: 2px;">教学点:</td>
      <td><input :style="{border:border_width,borderColor:telBC,backgroundColor:telBGC}" :disabled=textDisable  class="name-m" v-model="info.school_name" /></td>
    </tr>
    <tr>
      <td colspan="2" style="height:15px;"></td>
    </tr>
    <tr>
      <td width="25%" class="name-t">宝宝姓名:</td>
      <td><input :style="{border:border_width,borderColor:babyNameBC,backgroundColor:babyNameBGC}" :disabled=textDisable :placeholder=babyNamePlaceholder class="name-m" type="text" v-model="info.child_name" /></td>
    </tr>
    <tr>
      <td colspan="2" style="height:15px;"></td>
    </tr>
    <tr>
      <td width="25%" class="name-t">宝宝月龄:</td>
      <td style="height:35px;color: #9e9e9e;text-align:left;padding-left:8px">{{info.birthday | birthdayFilter}}</td>
    </tr>
    <tr>
      <td colspan="2" style="height:15px;"></td>
    </tr>
    <tr>
      <td width="25%" class="name-t">宝宝性别:</td>
      <td style="height:35px;color: #9e9e9e;text-align:left;padding-left:8px">{{info.sex | sexFilter}}</td>
    </tr>
  </table>
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
      confirmText: '申请确认',
      show_sex: "女",
      border_width: 0,
      textDisable: true,

      bPlaceholder: '请输入宝宝的月龄',
      telPlaceholder: '请输入11位手机号',
      namePlaceholder: '',
      babyNamePlaceholder: '',
      telBC: '#e5e5e5',
      telBGC: '#FFFFFF',
      parentNameBC: '#e5e5e5',
      parentNameBGC: '#FFFFFF',
      ageNameBC: '#e5e5e5',
      ageNameBGC: '#FFFFFF',
      babyNameBC: '#e5e5e5',
      babyNameBGC: '#FFFFFF',
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
      datalist: [{
        active: 0, //此处acitve 是小孩的
        parentid: '',
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
  filters: {
    sexFilter(value) {
      if (value == 1) {
        return "男"
      } else {
        return "女"
      }
    },
    birthdayFilter(value) {
      const birthday = tool.months_of_age(value)
      return birthday + '个月'
    }
  },
  created() {
    var l = this.$route.params.datalist;
    this.datalist = l;
  },
  computed: {
    noteText() {
      const l = this.datalist[0]
      if (l.active == 1 && typeof l != undefined ) {
        return "您的审核已经通过了";
      }
      return "成功申请,请耐心等待管理员审核";
    }
  }
}
</script>

<style>
.name-t {
  font-size: 15px;
  color: #9e9e9e;
  text-align: left;
}

.name-m {
  appearance: none;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
  width: 96%;
  height: 35px;
  line-height: 35px;
  font-size: 15px;
}

.radio-g {
  padding: 5px;
  border: #e5e5e5 solid 1px;
}

.select-s {
  background-color: #ffffff;
  font-size: 15px;
  height: 35px;
  width: 100%;
  line-height: 35px;
  border: 1px solid #e5e5e5;
}

.div-border {
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}

.appointment {
  background-color: #32a9b1;
  border-color: #32a9b1;
  border-radius: 4px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.button {
  padding-top: 5px;
  width: 90%;
  height: 30px;
}

a {
  position: relative;
  top: 8px;
  color: #ffffff;
  text-decoration: none;
}

a:hover {
  color: #ffffff;
}
</style>
