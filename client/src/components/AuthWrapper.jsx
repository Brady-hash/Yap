import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import AuthService from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
  const { authUser, logout } = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authUser) {
      AuthService.redirectToLogin(navigate);
    }
  }, [authUser, navigate]);

  return <>{children}</>;
};

export default AuthWrapper;