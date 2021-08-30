import Vue from 'vue';
import Vuex from 'vuex';
import { CssRule } from '@/types';
import { initializeBreakpoints } from '@/Breakpoints';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isEnabled: false,
    position: null,
    displayPosition: 'selectTopLeft',
    selectedRule: -1,
    cssRules: {},
  } as {
    isEnabled: boolean,
    position: { top: number, left: number } | null,
    displayPosition: string,
    selectedRule: number,
    cssRules: Record<number, CssRule>,
  },
  mutations: {
    setEnabled(state, isEnabled) {
      state.isEnabled = isEnabled;
    },
    setSelectedRule(state, selectedRule) {
      state.selectedRule = selectedRule;
    },
    setDisplayPosition(state, displayPosition) {
      state.displayPosition = displayPosition;
    },
    addCssRule(state, cssRule) {
      state.cssRules = { ...state.cssRules, [cssRule.id]: cssRule };
    },
    deleteCssRule(state, ruleId) {
      const { cssRules } = state;
      delete cssRules[ruleId];
      state.selectedRule = -1;
    },
    setInitialState(state, {
      hostValues,
      cssRules,
    }) {
      state.cssRules = initializeBreakpoints(cssRules);
      if (hostValues) {
        state.isEnabled = hostValues.isEnabled;
        state.position = hostValues.position;
        state.displayPosition = hostValues.displayPosition ?? 'selectTopLeft';
        state.selectedRule = hostValues.selectedRule ?? -1;
        if (!state.cssRules[hostValues.selectedRule]) {
          state.selectedRule = -1;
        }
      }
    },
  },
  actions: {
  },
  modules: {
  },
});
