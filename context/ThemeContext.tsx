import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ThemeType;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ThemeType>(deviceColorScheme || 'light');

  // Update color scheme when device setting changes
  useEffect(() => {
    if (deviceColorScheme) {
      setColorScheme(deviceColorScheme);
    }
  }, [deviceColorScheme]);

  const toggleColorScheme = () => {
    setColorScheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};