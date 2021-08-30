import Vue from 'vue';
import App from './App.vue';
import store from '../store';
import '../assets/tailwind.css';

Vue.directive('tooltip', (el, binding, VNode) => {
  const tooltipText = binding.expression;
  if (tooltipText) {
    const position = binding.arg ?? 'top';
    // const tooltip = `<span class="tooltiptext">${tootipText}</span>`;
    const tooltip = el.ownerDocument.createElement('span');
    el.style.position = 'relative';
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
});
