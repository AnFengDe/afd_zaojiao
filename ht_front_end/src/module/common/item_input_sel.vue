<template>
<div class="item-cell">
  <div class="title-cell" :style=style_label>{{this.title}}</div>
  <select :style="{border:border_width}" class="input-cell selection" :disabled=currentState v-model="currentValue">
    <template v-for="data in data_set">
      <option :value="data[data_id]" v-if="data[data_id] == data_default" v-text="data[data_text]" selected></option>
      <option :value="data[data_id]" v-else v-text="data[data_text]"></option>
</template>
  </select>
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
  name: "item_input_sel",
  methods: {},
  //options表示是否必须有符合条件的输入，默认为true
  props: ["title", "value", "disabled", "placeholder", "hint", "options", "data_set", "data_id", "data_text", "data_default", "style_label"],
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
.selection {
    margin-left: 1px;
    @include form_selection(75%);
}
</style>
