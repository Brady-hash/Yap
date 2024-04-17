import { createTheme } from '@mui/material/styles';

// Define primary colors for simplicity
const primaryLight = '#008080'; 
const primaryDark = '#D3D3D3'; 
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#008080',
    },
    secondary: {
      main: mode === 'light' ? '#49beb7' : '#2c5d63'
    },
    danger: {
        primary: '#f50057',
        secondary: 'darkred' 
    }, 
    text: {
      primary: mode === 'light' ? '#000000' : '#FFFFFF',
      secondary: mode === 'light' ? '#666666' : '#CCCCCC' 
    },
    utility: {
      main: '#999', 
      secondary: mode === 'light' ? '#D3D3D3' : '#606470',
      contrastText: mode === 'light' ? '#333333' : '#FFFFF0', 
    }
  },
});

// Create themes based on light and dark modes
const lightTheme = createTheme(getDesignTokens('light'));
const darkTheme = createTheme(getDesignTokens('dark'));