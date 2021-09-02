<template>
  <div
    class="absolute color-display"
    style="top: 8px; left: 8px; width: 32px; height: 32px;"
    @click="showColorPicker = true"
    ref="containerDiv"
  >
    <svg height="24" width="24"
    >
      <rect  height="24" width="24" :fill="value"/>
    </svg>
    <div
      v-if="showColorPicker"
      class="absolute bottom-0 bg-gray-700 rounded-full"
      :style="`width: ${size}px; height:${size}px; left:35px;`"
    >
      <color-picker
        :value="value" @input="e => $emit('input', e)" :width="size" :height="size"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ColorPicker from 'vue-color-picker-wheel';

export default Vue.extend({
  name: 'ColorInput',
  components: { ColorPicker },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    showColorPicker: false,
    size: 150,
  }),
  methods: {
    handleClick(e: MouseEvent) {
      if (!((this.$refs.containerDiv as HTMLDivElement)?.contains(e.target as Node))) {
        this.showColorPicker = false;
      }
    },
  },
  created() {
    document.addEventListener('mousedown', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleClick);
  },
});
</script>

<style scoped>

</style>
