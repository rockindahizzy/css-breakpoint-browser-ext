<template>
  <div class="dark:bg-black grid grid-cols-2 gap-4">
    <button
      name="selectPos"
      id="selectTopLeft"
      v-bind:class="background('selectTopLeft')"
      class="top-left"
      @click="onChangeSelection('selectTopLeft')"
    >
    </button>
    <button
      name="selectPos"
      id="selectTopRight"
      v-bind:class="background('selectTopRight')"
      class="top-right"
      @click="onChangeSelection('selectTopRight')"
    >
    </button>
    <button
      name="selectPos"
      id="selectBtmLeft"
      v-bind:class="background('selectBtmLeft')"
      class="bottom-left"
      @click="onChangeSelection('selectBtmLeft')"
    >
    </button>
    <button
      name="selectPos"
      id="selectBtmRight"
      class="bottom-right"
      v-bind:class="background('selectBtmRight')"
      @click="onChangeSelection('selectBtmRight')"
    >
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import browser from 'webextension-polyfill';

export default Vue.extend({
  name: 'PositionSelector',
  computed: mapState(['displayPosition']),
  methods: {
    ...mapMutations(['setDisplayPosition']),
    onChangeSelection(selection: string) {
      browser.runtime.sendMessage({ action: 'CHANGE_POSITION', value: selection });
      this.setDisplayPosition(selection);
    },
    background(position: string) {
      const selected = this.displayPosition === position;
      return {
        selectedClass: selected,
        defaultClass: !selected,
      };
    },
  },
});
</script>

<style scoped lang="scss">
  .selectedClass {
    @apply bg-green-500;
  }
  .defaultClass {
    @apply bg-white dark:bg-black;
  }
  .button {
    @apply border-blue-500 w-full h-14;
  }
  .top-left {
    @extend .button;
    @apply border-t-2 border-l-2;
  }
  .top-right {
    @extend .button;
    @apply border-t-2 border-r-2;
  }
  .bottom-left {
    @extend .button;
    @apply border-b-2 border-l-2;
  }
  .bottom-right {
    @extend .button;
    @apply border-b-2 border-r-2;
  }
</style>
