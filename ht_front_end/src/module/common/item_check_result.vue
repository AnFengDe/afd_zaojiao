<template>
<div>
  <div class="banner">
    <img src="./success_btn.png">
    <span>{{this.success_title}}</span>
  </div>
  <div class="card_1">
    <div class="child_name_1">
      宝宝:{{this.child_name}}
    </div>
  </div>
  <div style="width:100%;background-color:#d9d9d9;height:1px;margin-top:0"></div>
  <div class="card_2">
    <table style="margin-top:10px;width:100%">
      <tr>
        <td class="titile_td">接送时间</td>
        <td class="context_td">{{this.check_time}}</td>
      </tr>
      <tr>
        <td class="titile_td">操作人</td>
        <td class="context_td">{{this.operater}}</td>
      </tr>
    </table>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  components: {

  },
  methods: {},
  //options表示是否必须有符合条件的输入，默认为true
  name: "item_check_result",
  props: ["child_name", "check_time", "operater","success_title"],
  computed: {}
};
</script>

<style lang="scss" scoped type="text/css">@import "src/css/common.scss";
.banner {
    display: flex;
    justify-content: left;
    align-items: center;
    height: 50px;
    background-color: #e0e0e0;
}
img {
    margin-left: 10px;
    width: 22px;
    height: 22px;
}
span {
    margin-left: 10px;
    color: #2cac07;
    font-size: 16px;
}
.card_1 {
    height: 70px;
    background-color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
}
.child_name_1 {
    font-weight: bold;
    font-size: 21px;
}
.card_2 {
    height: 100px;
    background-color: #FFF;
}
.titile_td {
    color: #6E6E6E;
    line-height: 40px;
    font-size: 16px;
    text-align: left;
    padding-left: 10px;
    width: 49%;
}
.context_td {
    color: #6E6E6E;
    line-height: 40px;
    font-size: 16px;
    text-align: right;
    padding-right: 10px;
    width: 49%;
}
</style>
