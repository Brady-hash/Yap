import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../theme/theme';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('dark');

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const isDarkMode = mode === 'dark';

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, theme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
