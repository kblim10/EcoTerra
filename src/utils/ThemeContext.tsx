import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tema aplikasi berdasarkan palet warna yang ditentukan
export const theme = {
  colors: {
    primary: '#1A788E',
    secondary: '#0A363F',
    accent1: '#E1E0C0',
    accent2: '#A7A691',
    accent3: '#ECEAC9',
    background: '#FFFFFF',
    text: '#333333',
    textLight: '#FFFFFF',
    error: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FFC107',
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 999,
  },
};

// Tipe tema
type Theme = typeof theme;

// Context untuk tema
const ThemeContext = createContext<Theme>(theme);

// Hook untuk menggunakan tema
export const useTheme = () => useContext(ThemeContext);

// Provider untuk tema
export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentTheme] = useState<Theme>(theme);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
}; 