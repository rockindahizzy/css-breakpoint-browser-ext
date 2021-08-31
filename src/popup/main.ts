import Vue from 'vue';
import App from './App.vue';
import store from '../store';
import '../assets/tailwind.css';
import tooltipDirective from '@/directives/tooltip-directive';

Vue.directive('tooltip', tooltipDirective);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
});
