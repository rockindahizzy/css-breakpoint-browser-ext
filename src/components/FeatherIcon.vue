<template>
  <div @click="$emit('click')" v-html="icon"></div>
</template>

<script>
import { icons } from 'feather-icons';
import Vue from 'vue';

export default Vue.extend({
  name: 'FeatherIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    iconClass: String,
  },
  computed: {
    icon() {
      return icons[this.name].toSvg({ class: this.iconClass });
    },
  },
});
</script>

<style scoped>

</style>
