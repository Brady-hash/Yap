import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';


const LoginPage =  () => {
    const navigate = useNavigate();

    const navigateToSignup = () => {
        navigate('/signup');
    }

    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
            <button onClick ={navigateToSignup}> Signup </button>
        </div>
    );
};

export default  LoginPage;