import { createContext, FC, useContext, useEffect, useState } from 'react';
import { isBrowser, localStorageSecure } from '../lib/utils';
import { Theme } from '../pages';

export type NotificationType = 'error' | 'success' | 'warning' | 'information';

type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
};

type AppContextType = {
  user: User | null;
  theme: Theme;
  notificationType: NotificationType | null;
  message: string | null;
  toggleTheme: () => void;
  hasMessage: boolean;
  persistUser: (user: User) => void;
  setNotificationType: (notificationType: NotificationType) => void;
  setMessage: (message: string) => void;
  resetNotification: () => void;
  mapColors: (type: NotificationType) => string;
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
  hasMessage: false,
  message: null,
  notificationType: null,
  setMessage: () => {},
  setNotificationType: () => {},
  resetNotification: () => {},
  mapColors: () => '',
} as AppContextType;

const AppContext = createContext<AppContextType>({
  user: defaultValues.user,
  theme: defaultValues.theme,
  toggleTheme: defaultValues.toggleTheme,
  persistUser: defaultValues.persistUser,
  hasMessage: defaultValues.hasMessage,
  message: defaultValues.message,
  notificationType: defaultValues.notificationType,
  resetNotification: defaultValues.resetNotification,
  setMessage: defaultValues.setMessage,
  setNotificationType: defaultValues.setNotificationType,
  mapColors: defaultValues.mapColors,
});

export const useApp = () => useContext(AppContext);

export const AppProvider: FC = ({ children }) => {
  const [user, setUser] = useState(defaultValues.user);
  const [theme, setTheme] = useState(defaultValues.theme);
  const [message, setMessage] = useState<string | null>(defaultValues.message);
  const [notificationType, setNotificationType] = useState<NotificationType | null>(defaultValues.notificationType);

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

  const mapColors = (type: NotificationType) => {
    switch (type) {
      case 'error':
        return 'bg-red-500';
      case 'information':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
    }
  };

  const resetNotification = () => {
    setMessage(null);
    setNotificationType(null);
  };

  const value = {
    persistUser,
    user,
    theme,
    toggleTheme,
    hasMessage: !!message,
    mapColors,
    notificationType,
    message,
    resetNotification,
    setMessage,
    setNotificationType,
  } as AppContextType;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
