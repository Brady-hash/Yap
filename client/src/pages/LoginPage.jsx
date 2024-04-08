import LoginForm from '../components/forms/LoginForm';
import { Container, Typography, Box } from '@mui/material';

const LoginPage = () => {

    return (
        <Container 
        component="main" 
        maxWidth="xs"
        sx={{
            height: "100vh",
            display: "flex",
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 0,
            alignItems: 'center',
        }}
        >
             <Box sx={{ width: 400, my: 1 }}>
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
                // width: "100%",
                mb: 0,
            }}
              >
                Login
            </Typography>
            <LoginForm />
        </Container>
    );
};

export default LoginPage;
