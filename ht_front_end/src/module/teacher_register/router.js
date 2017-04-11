'use strict'

const Vue = require('vue')
const VueRouter = require('vue-router')

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'teacher_register',
      component: require("./App.vue")
    }
  ]
})
