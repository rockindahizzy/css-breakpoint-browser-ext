<template>
  <div>
    <div class="relative">
      <div class="flex items-center">
        <div
          class="flex w-36 cursor-pointer border-b border-gray-500 justify-between mr-2"
          @click="toggleDropdown"
        >
          <div
            :title="cssRules[selectedRule].name"
            class="w-full text-black dark:text-white pr-10 text-lg truncate"
          >
            {{cssRules[selectedRule].name}}
          </div>
          <feather-icon
            name="chevron-down"
            icon-class="text-blue-500"
          />
        </div>
        <feather-icon
          v-tooltip="Edit"
          v-if="this.selectedRule >= 0"
          name="edit-2"
          icon-class="h-4"
          @click="customizeBreakpoints('edit')"
        />
        <feather-icon
          v-tooltip="Copy"
          name="copy"
          icon-class="h-4"
          @click="customizeBreakpoints('copy')"
        />
        <feather-icon
          v-tooltip="Create"
          name="plus-square"
          icon-class="h-4"
          @click="customizeBreakpoints('create')"
        />
      </div>
      <div
        v-if="showDropdown"
        class="bg-gray-400 dark:bg-white absolute w-full h-28 rounded top-8 overflow-y-scroll"
      >
        <div
          v-for="rule in ruleOptions" :key="rule.id"
          :class="{
            'bg-green-500': rule.id === selectedRule,
            ...getSelectionClass(rule.id)
          }"
          class="text-black hover:bg-blue-300 px-2 py-4"
          @click="selectionChanged(rule.id)">
            {{rule.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import browser from 'webextension-polyfill';
import { Breakpoint } from '@/types';
import FeatherIcon from '@/components/FeatherIcon.vue';

export default Vue.extend({
  name: 'DropdownMenu',
  components: { FeatherIcon },
  data: () => ({
    showDropdown: false,
  }),
  methods: {
    ...mapMutations(['setSelectedRule']),
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    getSelectionClass(index: number) {
      return {
        'rounded-t': index === 0,
        'rounded-b': index === this.ruleOptions.length - 1,
      };
    },
    selectionChanged(selectedId: number) {
      browser.runtime.sendMessage({ action: 'CHANGE_BREAKPOINT_RULE', value: selectedId });
      this.setSelectedRule(selectedId);
      this.showDropdown = false;
    },
    customizeBreakpoints(action: string) {
      browser.runtime.sendMessage({
        action: 'CUSTOMIZE_BREAKPOINTS',
        value: {
          action,
          value: this.selectedRule,
        },
      });
      this.$emit('customize', {
        action,
        ruleId: action !== 'create' ? this.selectedRule : undefined,
      });
    },
  },
  computed: {
    ...mapState(['selectedRule', 'cssRules']),
    ruleOptions(): Breakpoint[] {
      return Object.values(this.cssRules);
    },
  },
});
</script>

<style scoped>

</style>
