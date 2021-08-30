<template>
  <div class="p-4 text-black dark:text-white">
    <div v-if="loading">Loading</div>
    <div v-else-if="customizingBreakpoints">
      <css-rule-form
        :customization-details="customizationOptions"
        @userAction="customizingBreakpoints = false"
      />
    </div>
    <div v-else class="flex flex-col gap-6">
      <div class="text-2xl flex gap-4 self-center">
        BreakPoints
      </div>
      <div class="">
        <div class="flex justify-center w-full settings-header mb-2">
          <span class="truncate">{{ hostname }}</span>
        </div>
        <div class="flex justify-between">
          <span style="font-size: 1rem;">Enabled</span>
          <label
            for="enableToggle"
            class="flex items-center cursor-pointer"
          >
            <div class="relative">
              <input
                id="enableToggle"
                type="checkbox"
                class="sr-only"
                @change="onToggle"
                v-bind:checked="isEnabled"
              />
              <div class="toggle-bg"></div>
              <div
                class="dot">
              </div>
            </div>
          </label>
        </div>
      </div>
      <dropdown-menu @customize="onCustomize"/>
      <position-selector />
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import browser from 'webextension-polyfill';
import { mapMutations, mapState } from 'vuex';
import { CssCustomizationMessage } from '@/types';
import CssRuleForm from '@/components/CssRuleForm.vue';
import { getValues } from '@/BrowserStorage';
import { getHostFromTabUrl } from '@/utils';
import PositionSelector from '@/components/PositionSelector.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';

export default Vue.extend({
  name: 'App',
  data: () => ({
    customizingBreakpoints: false,
    customizationOptions: null as CssCustomizationMessage | null,
    loading: true,
    hostname: 'here.com',
  }),
  components: { CssRuleForm, PositionSelector, DropdownMenu },
  methods: {
    async onToggle(): Promise<void> {
      const { isEnabled } = this;
      try {
        await browser.runtime.sendMessage({
          action: 'ENABLE_DISPLAY',
          value: !isEnabled,
        });
        this.setEnabled(!isEnabled);
      } catch (e) {}
    },
    onCustomize(data: CssCustomizationMessage) {
      this.customizationOptions = data;
      this.customizingBreakpoints = true;
    },
    ...mapMutations(['setInitialState', 'setEnabled']),
  },
  async created() {
    const [{ url }] = await browser.tabs.query({ active: true, currentWindow: true });
    if (url) {
      const hostname = getHostFromTabUrl(url);
      this.hostname = hostname;
      const { [hostname]: hostValues, cssRules } = await getValues([hostname, 'cssRules']);
      this.setInitialState({ hostValues, cssRules });
      this.loading = false;
    }
  },
  computed: mapState(['isEnabled']),
});
</script>

<style lang="scss">
  body {
    @apply
      bg-white
      dark:bg-black
    ;
    width: 250px;
  }
  .toggle-bg {
    @apply
      w-10
      h-5
      bg-gray-300
      dark:bg-gray-500
      rounded-full
      shadow-inner
    ;
  }

  .dot {
    @apply
    absolute
    w-5
    h-5
    bg-gray-500
    dark:bg-white
    rounded-full
    shadow
    left-0
    top-0
    transition
    ;
  }

  input:checked ~ .dot {
    @apply bg-green-500;
    transform: translateX(100%);
  }

  .settings-header {
    @apply text-blue-500;
    gap: 0.3rem;
    font-size: 1.1rem;
    font-weight: 500;
  }

  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;
</style>
