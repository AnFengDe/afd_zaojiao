<template>
<td class="name-t">
  {{currentValue}}</td>
</template>
<script>
export default {
  name: "item_td_text",
  props: ["note", "value"],
  computed: {
    currentValue: {
      // 动态计算currentValue的值,实现双向绑定
      get: function() {
        if (typeof this.value != 'undefined') {
          return this.value;
        } else {
          return this.note;
        }
      },
      set: function(val) {
        this.$emit('input', val);
      }
    }
  }
};
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
.name-t {
    @include label_td_title;
}
.name-td {
    @include label_td_context;
}
</style>
