// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import echarts from 'echarts';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/style.scss';
import router from './router';
import store from './store';
import axios from './http';
import App from './App';

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.use(Vuex);
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
