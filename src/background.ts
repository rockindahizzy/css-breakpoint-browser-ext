import { getValues, removeValue, saveValues } from './BrowserStorage';
import { Action } from './Action';
import * as browser from 'webextension-polyfill';
import { propagateMessage } from './BrowserMessaging';
import { getHostFromTabUrl } from './utils';

browser.runtime.onMessage.addListener((message: Action) => {
  browser.tabs.query({
    currentWindow: true,
    active: true,
  }).then(async (tabs) => {
    const [{ url }] = tabs;
    const hostName = getHostFromTabUrl(url);
    const values = await getValues(hostName);
    if (message.action === 'CHANGE_POSITION') {
      propagateMessage(message, tabs);
      saveValues({ [hostName]: { ...values[hostName], displayPosition: message.value as string } });
    } else if (message.action === 'CHANGE_BREAKPOINT_RULE') {
      propagateMessage(message, tabs);
      saveValues({ [hostName]: { ...values[hostName], selectedRule: message.value as string } });
    } else if (message.action === 'ENABLE_DISPLAY') {
      propagateMessage(message, tabs);
      saveValues({ [hostName]: { ...values[hostName], isEnabled: message.value } });
    }
  }).catch((e) => console.log(e));
});
