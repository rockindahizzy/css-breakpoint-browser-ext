<template>
  <div class="text-center">
    <div class="font-bold text-lg">Create Ruleset</div>
    <div class="mt-5 mb-5 border-t border-b pt-2 pb-4">
      <label>
        <span class="block" style="font-size: 1.2rem;">
          Name <span v-if="nameMissing" class="text-red-500">(Required)</span>
        </span>
        <input
          v-model="ruleName"
          maxlength="80"
          class="h-10"
          :class="{['border border-red-500']: nameMissing}"
          type="text"
          placeholder="Enter Display Name"
        />
      </label>
    </div>
    <div
      v-if="!isValid()"
      class="text-red-500 text-center mb-4">
      <p>Please verify values are ascending</p>
      <p>The final entry cannot have a width</p>
    </div>
    <div style="font-size: 1.2rem;">Breakpoints</div>
    <div class="flex justify-between text-center">
      <span>Color</span>
      <span>Name</span>
      <span>Max Width</span>
    </div>
    <div
      class="flex gap-4 mb-2 justify-between p-1"
      v-for="(breakpoint, i) in breakpoints"
      :key="i"
      :class="{['placeholder-input']: i === breakpoints.length - 1}"
    >
      <div class="relative">
        <feather-icon
          class="w-10 h-10"
          style="z-index: -1;"
          name="maximize"
          icon-class="w-10 h-10 text-blue-500"
        />
        <input
          class="absolute"
          style="top: 8px; left: 8px;"
          type="color"
          placeholder="#fff"
          v-model="breakpoint.color"
          @blur="(e) => onTextInput(e.target.value, breakpoint, i)"
        />
      </div>
      <input
        class="w-12"
        type="text"
        :class="{
          ['border-red-500']: breakpoint.nameValidationError,
        }"
        maxlength="4"
        v-model="breakpoint.name"
        :placeholder="i === breakpoints.length - 1 ? 'SM' : ''"
        @input="(e) => onTextInput(e.target.value, breakpoint, i)"
        @blur="(e) => validateMaxWidth(breakpoint, i)"
      />
      <input
        class="w-12"
        type="number"
        :class="{
          ['border-red-500']: breakpoint.widthValidationError,
        }"
        :placeholder="infinity"
        v-model.number="breakpoint.maxWidth"
        @input="(e) => onTextInput(e.target.value, breakpoint, i)"
        @blur="(e) => validateMaxWidth(breakpoint, i)"
      />
    </div>
    <div class="w-full flex gap-4 mt-4 justify-between">
      <div
          class="cursor-pointer text-red-500"
          title="cancel"
          @click="userAction('cancel')"
      >
        Cancel
      </div>
      <div
        class="cursor-pointer text-green-500"
        title="Save"
        @click="userAction('save')"
      >
        Save
      </div>
      <div
        v-if="customizationDetails.action === 'edit'"
        class="cursor-pointer"
        title="delete"
        @click="userAction('delete')"
      >
        Delete
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import { emitMessage } from '@/BrowserMessaging';
import { Breakpoint, CssRule } from '@/types';
import FeatherIcon from '@/components/FeatherIcon.vue';

type BreakpointInput = {
  name: string
  maxWidth: number | string | null
  color: string
  widthValidationError: boolean
  nameValidationError: boolean
};

export default Vue.extend({
  name: 'CssRuleForm',
  components: { FeatherIcon },
  props: {
    customizationDetails: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    inputValues: [] as BreakpointInput[],
    ruleName: '',
    // eslint-disable-next-line no-octal-escape
    infinity: '∞',
    nameMissing: false,
  }),
  async created() {
    const { action, ruleId } = this.customizationDetails;
    if (['edit', 'copy'].includes(action)) {
      const cssRule = this.cssRules[ruleId];
      this.ruleName = `${cssRule.name}${action === 'copy' ? ' copy' : ''}`;
      this.inputValues = cssRule.breakpoints;
    }
  },
  methods: {
    isBreakpointEmpty(breakpoint: BreakpointInput) {
      let isEmpty = false;
      isEmpty = breakpoint.name === '' || breakpoint.name == null;
      isEmpty &&= breakpoint.maxWidth === null || breakpoint.maxWidth <= 0 || breakpoint.maxWidth === '' || !breakpoint.maxWidth;
      return isEmpty;
    },
    isValid() {
      return !this.inputValues.find((v) => v.widthValidationError);
    },
    onTextInput(value: string, breakpoint: BreakpointInput, index: number) {
      if (index === this.inputValues.length && !this.isBreakpointEmpty(breakpoint)) {
        this.inputValues.push(breakpoint);
      }
      if (index === this.inputValues.length - 1 && this.isBreakpointEmpty(breakpoint)) {
        this.inputValues.splice(this.inputValues.length - 1);
      }
    },
    isFinalDataValid() {
      // Validate rule name
      let isValid = true;
      if (this.ruleName === '' || this.ruleName.length > 80) {
        this.nameMissing = true;
        isValid = false;
      }
      let prevWidth = -1;
      for (let i = 0; i < this.inputValues.length; i++) {
        const isLast = i === this.inputValues.length - 1;
        const { name, maxWidth } = this.inputValues[i];
        if (name === '') {
          this.inputValues[i].nameValidationError = true;
          isValid = false;
        }
        if (isLast && maxWidth !== null && maxWidth !== '' && maxWidth !== undefined) {
          this.inputValues[i].widthValidationError = true;
          isValid = false;
        }
        if (!isLast && (maxWidth === null || maxWidth === '' || maxWidth === undefined || maxWidth < prevWidth)) {
          this.inputValues[i].widthValidationError = true;
          isValid = false;
        }
        prevWidth = maxWidth as number;
      }
      return isValid;
    },
    userAction(action: 'save' | 'cancel' | 'delete') {
      const validated = this.isFinalDataValid();
      if (action === 'save' && validated) {
        let id;
        if (this.customizationDetails.action === 'edit') {
          id = this.customizationDetails.ruleId;
        } else {
          id = Math.max(...(Object.keys(this.cssRules)
            .map((k) => Number(k)))) + 1;
        }
        const newRule: CssRule = {
          id,
          name: this.ruleName,
          breakpoints: this.inputValues.map<Breakpoint>((v) => ({
            name: v.name,
            maxWidth: v.maxWidth === '' || v.maxWidth === null ? undefined : Number(v.maxWidth),
            color: v.color,
          })),
        };
        this.addCssRule(newRule);
        this.setSelectedRule(id);
        emitMessage({ action: 'SAVE_USER_CSS_RULE', value: newRule });
        emitMessage({ action: 'CHANGE_BREAKPOINT_RULE', value: id });
      } if (action === 'save' && !validated) {
        return this.$forceUpdate();
      }
      if (action === 'delete') {
        const { ruleId } = this.customizationDetails;
        this.deleteCssRule(ruleId);
        emitMessage({ action: 'DELETE_USER_CSS_RULE', value: ruleId });
        emitMessage({ action: 'CHANGE_BREAKPOINT_RULE', value: -1 });
      }
      return this.$emit('userAction');
    },
    validateMaxWidth(breakpoint: BreakpointInput, index: number) {
      if (index > 0 && index < this.inputValues.length) {
        const { maxWidth } = breakpoint;
        const { maxWidth: prevWidth } = this.inputValues[index - 1];
        if (maxWidth && prevWidth && Number(maxWidth) < Number(prevWidth)) {
          this.inputValues[index].widthValidationError = true;
        } else {
          this.inputValues[index].widthValidationError = false;
        }
      }
    },
    ...mapMutations(['addCssRule', 'deleteCssRule', 'setSelectedRule']),
  },
  computed: {
    breakpoints(): BreakpointInput[] {
      const returnValue = [] as BreakpointInput[];
      if (returnValue.length === 0) {
        returnValue.push({
          name: '',
          maxWidth: null,
          color: '#4b4bd7',
          widthValidationError: false,
          nameValidationError: false,
        });
      }
      return this.inputValues.concat(returnValue);
    },
    ...mapState(['cssRules']),
  },
});
</script>

<style scoped>
  .placeholder-input {
    @apply border-dashed dark:border-white border-2;
  }
  input[type="text"], input[type="number"]{
     @apply dark:bg-black dark:text-white border-solid border rounded ;
     font-weight: 900;
     text-align: center;
  }
  input[type="color"]{
    @apply
    h-6
    w-6
    outline-none;
   -webkit-appearance: none;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  input:focus::placeholder {
    color: transparent;
  }
</style>
