// eslint-disable-next-line import/prefer-default-export
export const getHostFromTabUrl = (url: string) => {
  const withoutHttps = url.substr(url.indexOf('://') + 3);
  return withoutHttps.substr(0, withoutHttps.indexOf('/'));
};
