import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeName, ThemeType } from './themes';

interface ThemeContextProps {
  theme: ThemeType;
  currentTheme: ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('light');

  useEffect(() => {
    AsyncStorage.getItem('@theme').then(storedTheme => {
      if (storedTheme && storedTheme in themes) {
        setCurrentTheme(storedTheme as ThemeName);
      }
    });
  }, []);

  const setTheme = async (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    await AsyncStorage.setItem('@theme', themeName);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[currentTheme],
        currentTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
