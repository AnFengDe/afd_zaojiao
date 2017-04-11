<template>
<div id="app">
  <div :style="{display:formDisplay}" class="title">
    <div class="title-context">教师申请表</div>
  </div>
  <table :style="{display:formDisplay}" width="100%;" cellpadding="0" cellspacing="0">
    <tr bolder="1px" class="table-tr" v-if="teachers.length>0" v-for="obj in teachers">
      <td width="15%" height="40" v-if='obj.active==0' v-text="obj.name"></td>
      <td width="5%" v-if='obj.active==0' v-text="obj.sex"></td>
      <td width="15%" v-if='obj.active==0'><a style="position: relative;top:0;color:#4f4f4f" v-bind:href="'tel:' + obj.mobile">{{ obj.mobile}}</a></td>
      <td width="30%" v-if='obj.active==0' v-text="obj.school_name"></td>
      <td width="10%" v-if='obj.active==0'>
        <div class="pass-div" @click="del(obj)"> 拒绝</div>
      </td>
      <td width="10%" v-if='obj.active==0'>
        <div class="pass-div" @click="pass(obj)"> 通过</div>
      </td>
    </tr>
  </table>
  <div :style="{display:formDisplay}" class="title" style="margin-top:15px;background-color:#cfc76b">
    <div class="title-context">在园教师表</div>
  </div>
  <table :style="{display:formDisplay}" width="100%;" cellpadding="0" cellspacing="0" v-if="">
    <tr bolder="1px" class="table-tr" v-if="teachers.length>0" v-for="obj in teachers">
      <td width="15%" height="40" v-if='obj.active==1' v-text="obj.name"></td>
      <td width="5%" v-if='obj.active==1' v-text="obj.sex"></td>
      <td width="15%" v-if='obj.active==1'><a style="position: relative;top:0;color:#4f4f4f" v-bind:href="'tel:' + obj.mobile">{{ obj.mobile}}</a></td>
      <td width="30%" v-if='obj.active==1' v-text="obj.school_name"></td>
      <td width="10%" v-if='obj.active==1'>
        <div class="del-div" @click="del(obj)">删除</div>
      </td>
    </tr>
  </table>
  <img :style="{width:divWidth,display:imgDisplay}" src="../../assets/no_record.png" />
</div>
</template>

<script>
import {
  updateTeacher,
  deleteTeacher,
  getTeachers,
} from 'src/js/request'
export default {
  data() {
    return {
      divWidth: '100%',
      imgDisplay: 'block',
      formDisplay: 'none',
      teachers: [{
        'openid': '',
        'teacherid': '',
        'active': -1,
        'name': '',
        'sex': 2,
        'school_name': '',
        'mobile': ''
      }]
    }
  },
  created() {
    getTeachers(this)
  },
  watch: {
    teachers(val, oldVal) {
      if (val.length > 0 && typeof val != 'undefined') {
        this.imgDisplay = 'none';
        this.formDisplay = 'block';
      } else {
        this.imgDisplay = 'block';
        this.formDisplay = 'none';
      }
    }
  },
  methods: {
    pass(obj) {
      updateTeacher(obj).then((res) => {
        if (res.data.code === 200) {
          obj.active = 1
        }
      }, (err) => {
        console.log(err);
      })
    },
    del(obj) {
      deleteTeacher(obj).then((res) => {
        if (res.data.code === 200) {
          let index = this.teachers.indexOf(obj)
          this.teachers.splice(index, 1)
        }
      }, (err) => {
        console.log(err);
      })
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
#app {
    @include app;
    td {
        font-size: 14px;
        @include black_font;
    }
    .title {
        width: 100%;
        height: 35px;
        background-color: #c1d389;
    }

    .title-context {
        padding-top: 10px;
        font-size: 14px;
        color: #ffffff;
    }

    .pass-div {
        padding-top: 5px;
        @include green_background_white_font;
        @include operate_button;
    }

    .table-tr {
        border: 1px solid #d9d9d9;
        background-color: #f9f9f9;
    }

    a {
        @include no_underline;
    }

    .del-div {
        padding-top: 5px;
        @include operate_button;
        @include gray_background_white_font;
    }
}
</style>
