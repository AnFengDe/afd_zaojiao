'use strict'

const Vue = require('vue')
const VueRouter = require('vue-router')

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'parent_register',
      component: require("./App.vue")
    },
    {
      path: '/info',
      name: 'parent_register_info',
      component: require("./components/parent_register_info.vue")
    }
  ]
})
