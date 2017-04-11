<template>
<div id="app">
  <div :style="{display:formDisplay}" v-for="info in freeRegisters" class="children-div">
    <table v-if="info.registerid != ''" height="45px" width="100%;" cellpadding="0" cellspacing="0">
      <tr>
        <item_td_text note="家长姓名:" />
        <item_td_text ref="ref_parent_name" v-model="info.parent_name" />
        <item_td_text note="宝宝姓名:" />
        <item_td_text ref="ref_child_name" v-model="info.child_name" />
      </tr>
      <tr>
        <item_td_text note="宝宝年龄:" />
        <item_td_text ref="ref_child_birthday" v-model="info.child_birthday" />
        <item_td_text style="letter-spacing: 4.4px;" note="教学点:" />
        <item_td_text ref="ref_name" v-model="info.name" />
      </tr>
    </table>
    <div v-if="info.registerid != ''" class="eie">
      <a v-bind:href="'tel:' + info.parent_mobile" style="position: relative;top:-4px;color:#4f4f4f">联系手机 {{info.parent_mobile}}</a>
      <button class="eie-btn" @click="clear(info)">删除</button>
    </div>
  </div>
  <img :style="{width:divWidth,display:imgDisplay}" src="../../assets/no_record.png" />
</div>
</template>

<script>
import * as request from 'src/js/request'

export default {
  data() {
    return {
      divWidth: '100%',
      imgDisplay: 'block',
      formDisplay: 'none',
      freeRegisters: [{
        parent_name: '',
        parent_mobile: '',
        child_name: '',
        child_birthday: '',
        name: '',
        registerid: ''
      }],
    }
  },
  watch: {
    freeRegisters(val, oldVal) {
      if (val.length > 0 && typeof val != 'undefined') {
        this.imgDisplay = 'none';
        this.formDisplay = 'block';
      } else {
        this.imgDisplay = 'block';
        this.formDisplay = 'none';
      }
    }
  },
  created() {
    request.getFreeRegisters(this)
  },
  methods: {
    clear(data) {
      let _this = this
      request.deleteFreeRegister(data.registerid).then((res) => {
        if (res.data.result_code === 1) {
          let index = _this.freeRegisters.indexOf(data)
          _this.freeRegisters.splice(index, 1)
        }
      }, (err) => {

      })
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
#app {
    @include app;
    .children-div {
        @include label_border;
        table {
            padding: 6px 10px;
            .name-t {
                @include label_td_title;
            }
            .name-td {
                @include label_td_context;
            }
        }
        .eie {
            @include label_bottom;
        }
        .eie-btn {
            @include label_button;
        }
        a {
            @include no_underline;
        }
    }
}
</style>
