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
      return AuthService.getProfile(token);
    } else {
      if (token) {
        AuthService.logout(); 
      }
      return null;
    }
  });

  const logout = () => {
    try {
        setAuthUser(null);
        AuthService.logout();
    } catch (error) {
        console.error('Logout Error:', error);
    }
};

const login = async (data) => {
  try {
    AuthService.login(data.login.token);
    if (!AuthService.isTokenExpired(data.login.token)) {
      setAuthUser(AuthService.getProfile(data.login.token));
    } else {
      logout();  // If the token is immediately expired, logout
    }
  } catch (error) {
    console.error('Login Error:', error);
  }
};



  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
