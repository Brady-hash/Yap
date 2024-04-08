import { Container, Typography, Box } from '@mui/material';
import SignupForm from '../components/forms/SignupForm';

const SignupPage = () => {
    return (
        <Container 
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
            <Box sx={{ width: 200, my: 1 }}>
                <img
                    src="/Yap-Logo.png"
                    alt="Logo"
                    style={{ width: '100%', height: 'auto' }}
                />
            </Box>
            <Typography 
                variant="h4"
                component="h1"
                sx={{
                    mb: 0,
                }}
            >
                Sign Up For Yap
            </Typography>
            <SignupForm />
        </Container>
    );
};

export default SignupPage;
