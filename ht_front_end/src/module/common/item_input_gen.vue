<template>
<div class="item-cell">
  <div class="title-cell" style="position:relative;left:2px;letter-spacing: 14px;">{{this.title}}</div>
  <div v-if="isEnable" class="input-cell" style="text-align:left;border:0">
    <span class="radio-g"><input type="radio" name="female" v-model="currentValue" value=2> 女</span>
    <span style="padding:10px;"></span>
    <span class="radio-g"><input type="radio" name="male" v-model="currentValue" value=1> 男</span>
  </div>
  <div class="input-cell" style="text-align:left;border:0" v-else>
    <input style="font-size:15px;" :style="{border:border_width}" type="text" :disabled=disabled v-model="showGender">
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      border_width: 0,
      border_color: '#e5e5e5',
      background_color: '#FFF'
    }
  },
  components: {

  },
  name: "item_input_gen",
  methods: {},
  //options表示是否必须有符合条件的输入，默认为true
  props: ["title", "value", "disabled", "options"],
  computed: {
    currentValue: {
      // 动态计算currentValue的值,实现双向绑定
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit('input', val);
      }
    },
    showGender: function() {
      return this.value == 1 ? '男' : '女';
    },
    isEnable() {
      return !this.disabled;
    },
    currentState() {
      let disabled = this.disabled || 0;
      this.border_width = disabled ? 0 : 1;
      return disabled !== 0;
    }
  }
};
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
.item-cell {
    margin-top: 12px;
    display: flex;
    align-items: flex-start;
    height: 35px;
    width: 100%;
}
.input-cell {
    @include form_input(72%);
    margin-right: 10px;
    align-self: center;
}
.title-cell {
    @include form_title;
    width: 30%;
    align-self: center;
}
.radio-g {
    padding: 5px;
    @include line;
}
</style>
