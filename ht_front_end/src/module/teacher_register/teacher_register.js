// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import item_input_txt from '../common/item_input_txt.vue';
import item_input_tel from '../common/item_input_tel.vue';
import item_input_sel from '../common/item_input_sel.vue';
import item_input_gen from '../common/item_input_gen.vue';

Vue.component("item_input_txt", item_input_txt);
Vue.component("item_input_tel", item_input_tel);
Vue.component("item_input_sel", item_input_sel);
Vue.component("item_input_gen", item_input_gen);

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
}).$mount('#app')
