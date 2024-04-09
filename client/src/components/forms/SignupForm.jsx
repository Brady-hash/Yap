import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_USER, LOGIN } from '../../utils/mutations';
import { useAuthContext } from '../../context/AuthContext';
import { TextField, Button, Alert, Box, CircularProgress  } from '@mui/material';

const SignupForm = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();

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

    return (
        <Box maxWidth="xs" sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading || !inputs.email || !inputs.username || !inputs.password || !inputs.confirmPassword}
                >
                    {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={navigateToLogin}
                    sx={{ mt: 1 }}
                >
                    Returning user login
                </Button>
                {error && <Alert severity="error" sx={{ width: '100%' }}>{error.message}</Alert>}
            </Box>
        </Box>
    );
};

export default SignupForm;
