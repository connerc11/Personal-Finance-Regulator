import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1976d2',
    },
    secondary: {
      main: mode === 'dark' ? '#f48fb1' : '#dc004e',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#fafafa',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#000000',
      secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: mode === 'dark' 
            ? '0 2px 8px rgba(0, 0, 0, 0.5)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
        },
      },
    },
  },
});

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Load from localStorage or settings
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        return settings.appearance?.theme || 'light';
      } catch {
        return 'light';
      }
    }
    return 'light';
  });

  const [actualMode, setActualMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (themeMode === 'auto') {
      // Use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualMode(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e: MediaQueryListEvent) => {
        setActualMode(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    } else {
      setActualMode(themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    // Update localStorage when theme changes
    const currentSettings = localStorage.getItem('appSettings');
    if (currentSettings) {
      try {
        const settings = JSON.parse(currentSettings);
        settings.appearance = settings.appearance || {};
        settings.appearance.theme = themeMode;
        localStorage.setItem('appSettings', JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }
  }, [themeMode]);

  const theme = useMemo(() => createTheme(getThemeOptions(actualMode)), [actualMode]);

  const contextValue = useMemo(() => ({
    themeMode,
    setThemeMode,
    theme
  }), [themeMode, setThemeMode, theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
