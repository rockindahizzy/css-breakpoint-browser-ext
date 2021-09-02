import browser from 'webextension-polyfill';
import { Action } from '@/Action';
import { CssRule } from '@/types';
import draggable from '@/draggable';
import {
  initializeBreakpoints,
} from '@/Breakpoints';
import { getValues } from '@/BrowserStorage';

let cssRules: Record<number, CssRule>;
let selectedCssRuleId: any;
let shadowHost: any;
let shadowRoot: any;
let currentPosition: string;
let draggedPosition: { top: number, left: number } | null;

const html = `
<style>
    .top-0 {
      top: 15px;
    }
    .bottom-0 {
      bottom: 15px;
    }
    .left-0 {
      left: 15px;
    }
    .right-0 {
      right: 15px;
    }
    .bp-container {
      position: fixed;
      display: flex;
      width: 4rem;
      height: 4rem;
      justify-content: center;
      text-align: center;
      color: white;
      border-radius: 9999px;
      flex-direction: column;
      z-index: 9999;
      box-shadow: black 0 0 12px;
      font-size: 1rem;
      cursor: move;
    }
</style>
<div id="bp-container" class="bp-container top-0 left-0">
</div>
`;

const getCurrentBreakpoint = (rule: CssRule, width: number) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const breakpoint of rule.breakpoints) {
    if (breakpoint.maxWidth === undefined
      || breakpoint.maxWidth === null
      || breakpoint.maxWidth > width
    ) {
      return breakpoint;
    }
  }
  return rule.breakpoints[0];
};

const updateDisplay = (width: number, root: ShadowRoot) => {
  const container = root.getElementById('bp-container');
  if (container) {
    const breakpoint = getCurrentBreakpoint(
      cssRules[selectedCssRuleId] ?? cssRules[-1],
      width,
    );
    container.style.backgroundColor = breakpoint.color;
    const leftPosition = Number(container.style.left.replace('px', ''));
    const topPosition = Number(container.style.top.replace('px', ''));
    if (leftPosition + container.offsetWidth > window.innerWidth) {
      container.style.left = `${(window.innerWidth - container.offsetWidth) - 15}px`;
    }
    if (topPosition + container.offsetHeight > window.innerHeight) {
      container.style.top = `${(window.innerHeight - container.offsetHeight) - 15}px`;
    }

    container.innerHTML = `
    <div>${breakpoint.name}</div>
    <div id="widthDisplay" class="text-sm">${window.innerWidth}</div>
  `;

    draggable(container);
  }
};

window.onresize = () => {
  updateDisplay(window.innerWidth, shadowRoot);
};

const onChangePosition = (value: string | string[]) => {
  const container = shadowRoot.getElementById('bp-container');
  const { classList } = container;
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

const toggleDisplay = async (isEnabled: boolean) => {
  if (isEnabled) {
    if (!selectedCssRuleId && !currentPosition) {
      selectedCssRuleId = -1;
      currentPosition = 'selectTopLeft';
    }
    if (!shadowHost) {
      shadowHost = document.createElement('div');
      shadowHost.id = 'breakpointCssHostContainer';
      shadowRoot = shadowHost.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = html;
      document.body.insertAdjacentElement('afterend', shadowHost);
    } else if (!document.getElementById('breakpointCssHostContainer')) {
      document.body.insertAdjacentElement('afterend', shadowHost);
    }
    // @ts-ignore
    const { [window.location.hostname]: values } = await getValues(window.location.hostname);
    draggedPosition = values?.position;
    onChangePosition(currentPosition);
    if (draggedPosition) {
      const container = shadowRoot.getElementById('bp-container');
      container.style.top = `${draggedPosition.top}px`;
      container.style.left = `${draggedPosition.left}px`;
    }
    updateDisplay(window.innerWidth, shadowRoot);
  } else {
    shadowHost.remove();
  }
};

browser.runtime.onMessage.addListener(({ action, value }: Action) => {
  if (action === 'CHANGE_POSITION') {
    shadowRoot.getElementById('bp-container').style.top = null;
    shadowRoot.getElementById('bp-container').style.left = null;
    draggedPosition = null;
    currentPosition = value as string;
    onChangePosition(value as string);
  } else if (action === 'CHANGE_BREAKPOINT_RULE') {
    selectedCssRuleId = value;
    updateDisplay(window.innerWidth, shadowRoot);
  } else if (action === 'ENABLE_DISPLAY') {
    toggleDisplay(value as boolean);
  } else if (action === 'SAVE_USER_CSS_RULE') {
    cssRules = initializeBreakpoints(value as Record<number, CssRule>);
    updateDisplay(window.innerWidth, shadowRoot);
  }
});

window.onfocus = () => {
  getValues().then((values: any) => {
    const hostValues = values[location.hostname];
    const { cssRules: storedCssRules } = values;
    selectedCssRuleId = hostValues?.selectedRule ?? -1;
    currentPosition = hostValues?.displayPosition ?? 'selectTopLeft';
    cssRules = initializeBreakpoints(storedCssRules);
    toggleDisplay(hostValues.isEnabled);
  });
};

getValues().then((values: any) => {
  const hostValues = values[location.hostname];
  const { cssRules: storedCssRules } = values;
  selectedCssRuleId = hostValues?.selectedRule ?? -1;
  currentPosition = hostValues?.displayPosition ?? 'selectTopLeft';
  draggedPosition = hostValues?.position;
  cssRules = initializeBreakpoints(storedCssRules);
  toggleDisplay(hostValues.isEnabled);
});
