import { createContext, FC, useContext, useEffect, useState } from 'react';
import { isBrowser, localStorageSecure } from '../lib/utils';
import { Theme } from '../pages';

type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
};

type AppContextType = {
  user: User | null;
  theme: Theme;
  toggleTheme: () => void;
  persistUser: (user: User) => void;
};

const userLocal = localStorageSecure('user');
const themeLocal = localStorageSecure('theme');

const userPrefersDark = () => {
  if (isBrowser()) {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
};

const userPreference = userPrefersDark();

const defaultValues = {
  user: userLocal ? (JSON.parse(userLocal) as User) : null,
  theme: themeLocal ?? (userPreference ? 'dark' : 'light'),
  toggleTheme: () => {},
  persistUser: () => {},
} as AppContextType;

const AppContext = createContext<AppContextType>({
  user: defaultValues.user,
  theme: defaultValues.theme,
  toggleTheme: defaultValues.toggleTheme,
  persistUser: defaultValues.persistUser,
});

export const useApp = () => useContext(AppContext);

export const AppProvider: FC = ({ children }) => {
  const [user, setUser] = useState(defaultValues.user);
  const [theme, setTheme] = useState(defaultValues.theme);

  useEffect(() => {
    theme === 'dark'
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    localStorage.setItem('theme', theme);
  };

  const persistUser = (user: User) => {
    setUser(() => ({
      id: Date.now(),
      email: user.email,
      username: Date.now().toString(),
      avatar: 'https://eu.ui-avatars.com/api/?name=John+Doe',
    }));

    localStorage.setItem('user', JSON.stringify(user));
  };

  const value = {
    persistUser,
    user,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
