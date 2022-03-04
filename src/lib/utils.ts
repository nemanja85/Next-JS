import { ValidationError } from 'yup';

export const localStorageSecure = (key: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(key);
};

export const isBrowser = () => typeof window !== 'undefined';

export const mapErrors = (errors: ValidationError) => {
  return errors.inner.map((x) => ({
    field: x.path!,
    message: x.message,
  }));
};

export const mapFilter = <T extends object>(columns: Array<keyof T> = []): Record<keyof T, boolean> => {
  const obj = {} as Record<keyof T, boolean>;

  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = !!columns[i];
  }

  return obj;
};
