import React, { createContext, useContext, ReactNode } from 'react';
import { createTheme, Theme } from '@mui/material/styles';

interface SimpleThemeContextType {
  theme: Theme;
}

const SimpleThemeContext = createContext<SimpleThemeContextType | undefined>(undefined);

export const useCustomTheme = () => {
  const context = useContext(SimpleThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <SimpleThemeContext.Provider value={{ theme }}>
      {children}
    </SimpleThemeContext.Provider>
  );
};
