import { Container, Typography, Box } from '@mui/material';
import SignupForm from '../components/forms/SignupForm';
import { useThemeContext } from '../context/ThemeContext';
import logoSrc from '../images/Yap-Logo.png';


const SignupPage = () => {
    const { theme } = useThemeContext()
    return (
        <Box 
            component="main" 
            maxWidth="xs"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 0,
            }}
        >
            <Box sx={{ width: 250, my: 1, zIndex: 2, mt: 15 }}>
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
                    mb: 0,
                    zIndex: 2,
                    color: theme.palette.text.primary
                }}
            >
                Sign up for Yap
            </Typography>
            <SignupForm />
        </Box>
    );
};

export default SignupPage;
