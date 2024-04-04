import React, { createContext, useContext, useState } from 'react';
import AuthService from '../utils/auth';
export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const token = AuthService.getToken();
    if (token && !AuthService.isTokenExpired(token)) {
      return AuthService.getProfile();
    }
    return null;
  });

  const logout = () => {
    setAuthUser(null);
    AuthService.logout();
  };

  const login = (userData) => {
    AuthService.login(userData.token);
    setAuthUser(AuthService.getProfile());
  };


  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
