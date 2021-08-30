import browser from 'webextension-polyfill';

export const saveValues = (values: Record<string, any>) => browser.storage.sync.set(values);
export const removeValue = (key: string) => browser.storage.sync.remove(key);

export const getValues = async (
  key?: string | string[] | Record<string, string>,
): Promise<Record<string, any>> => {
  try {
    return await browser.storage.sync.get(key);
  } catch (e) {
    throw e;
  }
};

export const saveHostValues = async (hostname: string, values: Record<string, any>) => {
  // @ts-ignore
  const { [hostname]: currentValues } = (await getValues(hostname)) as Record<string, any>;
  return browser.storage.sync.set({
    [hostname]: {
      ...currentValues,
      ...values,
    },
  });
};

export const deleteHostValues = async (hostname: string, ...keys: string[]) => {
  // @ts-ignore
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
