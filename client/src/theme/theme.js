import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Example color, choose what fits your design
    },
    secondary: {
      main: '#ce93d8', // Example color, choose what fits your design
    },
    background: {
      default: '#121212',
      paper: '#333333',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Example style override
        },
      },
    },
    // Add other component overrides as needed
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Define other typography styles as needed
  },
  // Add other theme customizations as needed
});

export default darkTheme;
