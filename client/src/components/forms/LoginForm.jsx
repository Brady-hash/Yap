import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../utils/mutations';
import { useAuthContext } from '../../context/AuthContext';
import { TextField, Button, Alert, Box } from '@mui/material';

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: '', password: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [loginMutation, { error }] = useMutation(LOGIN);
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const { data } = await loginMutation({
                variables: { ...userFormData }
            });
    
            const { token } = data.login;
    
            if (token) {
                login(data);
                setShowAlert(false);
            } else {
                throw new Error('Token not received.');
            }
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }

        setUserFormData({ email: '', password: '' });
    };

    const navigateToSignup = () => {
        navigate('/signup');
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, margin: 'auto', marginTop: '.5vh', display: 'flex', flexDirection: 'column' }}>
            {showAlert && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error ? error.message : 'Something went wrong with your login credentials!'}
                </Alert>
            )}
            <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ width: '100%',}}>
                <TextField 
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={handleInputChange}
                    value={userFormData.email}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handleInputChange}
                    value={userFormData.password}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3}}
                    disabled={!userFormData.email || !userFormData.password}
                >
                    Login
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={navigateToSignup}
                    sx={{ mt: 1 }}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;
