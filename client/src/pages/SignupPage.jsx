import React from 'react';
import SignupForm from '../components/SignupForm';
import { useNavigate } from 'react-router-dom';


const SignupPage =  () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    }

    return (
        <div>
            <h1>Login</h1>
            <SignupForm/ >
            <button onClick ={navigateToLogin}> Login </button>
        </div>
    );
};

export default  SignupPage;