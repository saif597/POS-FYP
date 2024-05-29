import React, { createContext, useContext, useState } from 'react';

// Define the context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Define a theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // You can define other theme-related variables and functions here

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
