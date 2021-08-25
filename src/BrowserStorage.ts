import * as browser from 'webextension-polyfill';

export const saveValues = (values: Record<string, any>) => browser.storage.sync.set(values);
export const removeValue = (key: string) => browser.storage.sync.remove(key);

export const getValues = async (key?: string | string[] | Record<string, string>) => {
  try {
    return await browser.storage.sync.get(key);
  } catch (e) {
    console.log(e);
  }
};

export const saveHostValues = async (hostname: string, values: Record<string, any>) => {
  const { [hostname]: currentValues } = await getValues(hostname);
  return browser.storage.sync.set({
    [hostname]: {
      ...currentValues,
      ...values,
    },
  });
};

export const deleteHostValues = async (hostname: string, ...keys: string[]) => {
  const { [hostname]: currentValues } = await getValues(hostname);
  keys.forEach((key) => {
    delete currentValues[key];
  });

  return browser.storage.sync.set({
    [hostname]: {
      ...currentValues,
    },
  });
};

