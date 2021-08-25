import {
  deleteHostValues,
  getValues,
  removeValue,
  saveHostValues,
  saveValues,
} from './BrowserStorage';
import { Action } from './Action';
import * as browser from 'webextension-polyfill';
import { propagateMessage } from './BrowserMessaging';
import { getHostFromTabUrl } from './utils';

browser.runtime.onMessage.addListener(async (message: Action) => {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });
  const [{ url }] = tabs;
  const hostName = getHostFromTabUrl(url);
  if (message.action === 'CHANGE_POSITION') {
    propagateMessage(message, tabs);
    await deleteHostValues(hostName, 'position');
    return saveHostValues(hostName, { displayPosition: message.value as string });
  } else if (message.action === 'CHANGE_BREAKPOINT_RULE') {
    propagateMessage(message, tabs);
    return saveHostValues(hostName, { selectedRule: message.value as string });
  } else if (message.action === 'ENABLE_DISPLAY') {
    propagateMessage(message, tabs);
    return saveHostValues(hostName, { isEnabled: message.value });
  }
});
