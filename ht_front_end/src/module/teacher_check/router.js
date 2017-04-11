'use strict'

const Vue = require('vue')
const VueRouter = require('vue-router')
import { DatetimePicker } from 'mint-ui';

Vue.component(DatetimePicker.name, DatetimePicker);
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'shuttle',
      component: require("./App.vue")
    }
  ]
})
