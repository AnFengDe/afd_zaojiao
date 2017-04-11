<template>
<div class="item-cell">
  <div class="title-cell">{{this.title}}</div>
  <input :style="{border:border_width,borderColor:border_color,backgroundColor:background_color}" class="input-cell" :disabled=currentState :placeholder=placeholder_text type="text" @blur="check(this)" v-model="currentValue"/>
</div>
</template>
<script>
export default {
  data() {
    return {
      placeholder_text: this.placeholder,
      border_width: 1,
      border_color: '#e5e5e5',
      background_color: '#FFF'
    }
  },
  components: {

  },
  name: "item_input_txt",
  methods: {
    check() {
      if (this.value == "" && !(this.options || 0)) {
        this.placeholder_text = this.hint;
        this.border_color = '#d1000a';
        this.background_color = '#ffebec';
        return false;
      }
      this.border_color = '#e5e5e5';
      this.background_color = '#FFF';
      return true;
    },
  },
  //options表示是否必须有符合条件的输入，默认为true
  props: ["title", "value", "disabled", "placeholder", "hint", "options"],
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
</style>
