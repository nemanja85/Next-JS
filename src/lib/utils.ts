export const localStorageSecure = (key: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(key);
};

export const isBrowser = () => typeof window !== 'undefined';
