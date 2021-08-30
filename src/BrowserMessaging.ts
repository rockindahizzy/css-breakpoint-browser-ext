import browser, { Tabs } from 'webextension-polyfill';
import { Action } from '@/Action';
import Tab = Tabs.Tab;

export const emitMessage = (message: Action) => browser.runtime.sendMessage(message);

// eslint-disable-next-line import/prefer-default-export
export const propagateMessage = (message: any, tabs: Tab[]) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const tab of tabs) {
    if (tab.id) {
      browser.tabs.sendMessage(
        tab.id,
        message,
      ).catch((e) => console.log(e));
    }
  }
};
