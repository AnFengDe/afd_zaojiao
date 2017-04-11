'use strict'

const Vue = require('vue')
const VueRouter = require('vue-router')
import item_td_text from '../common/item_td_text.vue';
Vue.component("item_td_text", item_td_text);
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'parent_verification',
      component: require("./App.vue")
    }
  ]
})
