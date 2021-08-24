import * as browser from 'webextension-polyfill';

export const propagateMessage = (message, tabs) => {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      message,
    ).catch((e) => console.log(e));
  }
};
