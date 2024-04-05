import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import AuthService from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
  const { authUser, login, logout } = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkTokenValidity = async () => {
      // Check if the token is expired
      if (authUser && AuthService.isTokenExpired(authUser.token)) {
        try {
          // Attempt to refresh the token or perform any necessary actions
          // For example:
          // const newToken = await AuthService.refreshToken(authUser.token);
          // login({ token: newToken });
          console.log('Token expired. Refreshing token...');
        } catch (error) {
          console.error('Error refreshing token:', error);
          logout(); // Logout user if token refresh fails
          navigate('/login');
        }
      }
    };

    // If there is no authenticated user, navigate to the login page
    if (!authUser) {
      navigate('/login');
    } else {
      checkTokenValidity(); // Check token validity for authenticated user
    }
  }, [authUser, navigate, login, logout]);

  return <>{children}</>;
};

export default AuthWrapper;
