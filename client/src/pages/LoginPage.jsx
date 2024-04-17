import LoginForm from '../components/forms/LoginForm';
import { Typography, Box } from '@mui/material';
import logoSrc from '../images/Yap-Logo.png';
import { useThemeContext } from '../context/ThemeContext';

const LoginPage = () => {
    const { theme } = useThemeContext();
    return (
        <Box 
        maxWidth="xs"
        sx={{
            height: "100vh",
            display: "flex",
            zIndex: 2,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 0,
            alignItems: 'center',
        }}
        >
             <Box sx={{ width: 325, mt: 20, zIndex: 2 }}>
                <img
                    src={logoSrc}
                    alt="Logo"
                    style={{ width: '100%', height: 'auto' }}
                />
            </Box>
            <Typography 
            variant="h4"
            component="h1"
            sx={{
                // width: "100%",
                zIndex: 2,
                mb: 0,
                color: theme.palette.text.primary
            }}
              >
                Welcome Back
            </Typography>
            <LoginForm />
        </Box>
    );
};

export default LoginPage;
