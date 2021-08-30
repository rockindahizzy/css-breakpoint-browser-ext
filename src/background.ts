import * as browser from 'webextension-polyfill';
import { CssRule } from '@/types';
import {
  deleteHostValues,
  getValues,
  saveHostValues,
  saveValues,
} from './BrowserStorage';
import { Action } from './Action';
import { propagateMessage } from './BrowserMessaging';
import { getHostFromTabUrl } from './utils';

browser.runtime.onMessage.addListener(async (message: Action) => {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });
  const [{ url }] = tabs;
  const hostName = getHostFromTabUrl(url ?? '');
  if (message.action === 'CHANGE_POSITION') {
    propagateMessage(message, tabs);
    await deleteHostValues(hostName, 'position');
    return saveHostValues(hostName, { displayPosition: message.value as string });
  }
  if (message.action === 'CHANGE_BREAKPOINT_RULE') {
    propagateMessage(message, tabs);
    return saveHostValues(hostName, { selectedRule: message.value });
  }
  if (message.action === 'ENABLE_DISPLAY') {
    propagateMessage(message, tabs);
    return saveHostValues(hostName, { isEnabled: message.value });
  }
  if (message.action === 'SAVE_USER_CSS_RULE') {
    const { cssRules } = await getValues('cssRules');
    const cssRule = message.value as CssRule;
    const newRules = {
      cssRules: {
        ...cssRules,
        [cssRule.id]: cssRule,
      },
    };
    propagateMessage({ action: message.action, value: newRules.cssRules }, tabs);
    return saveValues(newRules);
  }
  if (message.action === 'DELETE_USER_CSS_RULE') {
    const { cssRules } = await getValues('cssRules');
    delete cssRules[message.value];
    return saveValues({ cssRules });
  }
  throw Error('unknown action');
});
