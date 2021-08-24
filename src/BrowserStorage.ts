import * as browser from 'webextension-polyfill';

export const saveValues = (values: Record<string, any>) => browser.storage.sync.set(values);

export const getValues = async (key?: string | string[] | Record<string, string>) => {
  try {
    const val = await browser.storage.sync.get(key);
    console.log(val);
    return val;
  } catch (e) {
    console.log(e);
  }
};

export const removeValue = (key: string) => browser.storage.sync.remove(key);
