import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../utils/mutations';
import { useAuthContext } from '../../context/AuthContext';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: '', password: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [loginMutation, { error }] = useMutation(LOGIN);
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const { theme } = useThemeContext();

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

    const textFieldSx = {
        '& .MuiInputBase-input': {
          color: theme.palette.text.primary, 
        },
        '& label.Mui-focused': {
          color: theme.palette.primary.main, 
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.primary.main
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main 
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white'
          },
        }
      };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, margin: 'auto', marginTop: '.5vh', display: 'flex', flexDirection: 'column',zIndex: 2 }}>
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
                    sx={textFieldSx}
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
                    sx={textFieldSx}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                        my: 3, 
                        bgcolor: theme.palette.primary.main,
                        // color: theme.palette.utility.contrastText,
                        '&:hover': { bgcolor: theme.palette.secondary.main }
                    }}
                    disabled={!userFormData.email || !userFormData.password}
                >
                    Login
                </Button>
                <Box>
                <Typography variant='h7' sx={{ zIndex: 2, color: theme.palette.text.primary }}>Don't have an account?</Typography>
                </Box>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={navigateToSignup}
                    sx={{  
                        my: 1,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.utility.contrastText,
                        '&:hover': { borderColor: theme.palette.secondary.main }
                    }}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;
