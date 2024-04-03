import React, { useEffect } from 'react';
import AuthService from '../utils/auth';

const AuthWrapper = ({ children }) => {
  useEffect(() => {
    if (!AuthService.loggedIn()) {
      AuthService.redirectToLogin();
    }
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;