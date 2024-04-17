import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_USER, LOGIN } from '../../utils/mutations';
import { useAuthContext } from '../../context/AuthContext';
import { TextField, Button, Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';

const SignupForm = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const { theme } = useThemeContext();

    const [inputs, setInputs] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [addUser, { loading: addingUser }] = useMutation(ADD_USER);
    const [loginUser, { loading: loggingIn }] = useMutation(LOGIN);
    const loading = addingUser || loggingIn;
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputs.password !== inputs.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const addUserResponse = await addUser({
                variables: { email: inputs.email, username: inputs.username, password: inputs.password }
            });

            if (addUserResponse.data) {
                const loginResponse = await loginUser({
                    variables: {
                        email: inputs.email,
                        password: inputs.password
                    }
                });

                if (loginResponse.data) {
                    login(loginResponse.data);
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Signup error', err);
            setError(err);
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
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
        <Box maxWidth="xs" sx={{ mt: 1,  maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={inputs.email}
                    onChange={handleInputChange}
                    sx={textFieldSx}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={inputs.username}
                    onChange={handleInputChange}
                    sx={textFieldSx}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={inputs.password}
                    onChange={handleInputChange}
                    sx={textFieldSx}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={inputs.confirmPassword}
                    onChange={handleInputChange}
                    sx={textFieldSx}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                        my:3,
                        bgcolor: theme.palette.primary.main,
                        '&:hover': { bgcolor: theme.palette.secondary.main }
                    }}
                    disabled={loading || !inputs.email || !inputs.username || !inputs.password || !inputs.confirmPassword}
                >
                    {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
                <Typography variant='h7' sx={{ color: theme.palette.text.primary}}>Already have an account?</Typography>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={navigateToLogin}
                    sx={{ 
                        my: 1,
                        color: theme.palette.utility.contrastText,
                        borderColor: theme.palette.primary.main,
                        '&:hover': { borderColor: theme.palette.secondary.main }
                    }}
                >
                    Login
                </Button>
                {error && <Alert severity="error" sx={{ width: '100%' }}>{error.message}</Alert>}
            </Box>
        </Box>
    );
};

export default SignupForm;
