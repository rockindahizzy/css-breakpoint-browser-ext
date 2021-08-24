// @ts-ignore
import cssText from 'bundle-text:../dist/style.css';
import * as browser from 'webextension-polyfill';
import Breakpoints, { BreakPoint } from './breakpoints';
import { getValues } from './BrowserStorage';

let selectedBreakpointRules;
let shadowHost;
let shadowRoot;
let currentPosition;

const html = `
<style>${cssText}</style>
<div id="bp-container" class="top-0 left-0 bp-container text-md" style="z-index: 9999;">
  <div class="block  sm:hidden">MBL</div>
  <div class="hidden sm:block  md:hidden">SM</div>
  <div class="hidden md:block  lg:hidden ">MD</div>
  <div class="hidden lg:block  xl:hidden">LG</div>
  <div class="hidden xl:block 2xl:hidden">XL</div>
  <div class="hidden 2xl:block">2XL</div>
  <div id="widthDisplay" class="text-sm">${window.innerWidth}</div>
</div>
`;

const getCurrentBreakpoint = (breakPoints: BreakPoint[], width: number) => {
  for (const breakpoint of breakPoints) {
    if (breakpoint.maxWidth === undefined || breakpoint.maxWidth > width) {
      return breakpoint;
    }
  }
};

const updateDisplay = (width: number, root: ShadowRoot) => {
  const container = root.getElementById('bp-container');
  const breakPoint = getCurrentBreakpoint(
    selectedBreakpointRules === 'tailwindBuiltIn' ?
      Breakpoints.tailWindBreakPoints :
      Breakpoints.bootstrapBreakpoints,
    width,
  );
  container.innerHTML = `
    <div>${breakPoint.name}</div>
    <div id="widthDisplay" class="text-sm">${window.innerWidth}</div>
  `;
  container.style.backgroundColor = breakPoint.color;
};

window.onresize = () => {
  updateDisplay(window.innerWidth, shadowRoot);
};

const onChangePosition = (value) => {
  currentPosition = value;
  const container = shadowRoot.getElementById(('bp-container'));
  const classList = container.classList;
  if (value.includes('Top')) {
    classList.replace('bottom-0', 'top-0');
  } else {
    classList.replace('top-0', 'bottom-0');
  }
  if (value.includes('Right')) {
    classList.replace('left-0', 'right-0');
  } else {
    classList.replace('right-0', 'left-0');
  }
};

const onChangeBreakpointRules = (value) => {
  selectedBreakpointRules = value;
  updateDisplay(window.innerWidth, shadowRoot);
};

const toggleDisplay = (isEnabled: boolean) => {
  if (isEnabled) {
    if (!selectedBreakpointRules && !currentPosition){
      selectedBreakpointRules = 'bootstrapBuiltIn';
      currentPosition = 'selectTopLeft';
    }
    if (!document.getElementById('breakpointCssHostContainer')) {
      shadowHost = document.createElement('div');
      shadowHost.id = 'breakpointCssHostContainer';
      shadowRoot = shadowHost.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = html;
      document.body.insertAdjacentElement('afterend', shadowHost);
    }
    onChangePosition(currentPosition);
    updateDisplay(window.innerWidth, shadowRoot);
  } else {
    document.getElementById('breakpointCssHostContainer').remove();
  }
};

browser.runtime.onMessage.addListener(({ action, value }) => {
  if (action === 'CHANGE_POSITION') {
    onChangePosition(value);
  } else if (action === 'CHANGE_BREAKPOINT_RULE') {
    onChangeBreakpointRules(value);
  } else if (action == 'ENABLE_DISPLAY') {
    toggleDisplay(value);
  }
});

window.onfocus = () => {
  getValues().then(values => {
    const hostValues = values[location.hostname];
    selectedBreakpointRules = hostValues.selectedRule ?? 'bootstrapBuiltIn';
    currentPosition = hostValues.displayPosition ?? 'selectTopLeft';
    toggleDisplay(hostValues.isEnabled);
  });
};

getValues().then(values => {
  const hostValues = values[location.hostname];
  selectedBreakpointRules = hostValues.selectedRule ?? 'bootstrapBuiltIn';
  currentPosition = hostValues.displayPosition ?? 'selectTopLeft';
  toggleDisplay(hostValues.isEnabled);
});