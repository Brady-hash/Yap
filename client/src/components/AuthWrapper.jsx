import { useEffect } from 'react';
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
          //Later refresh token functionality 
          console.log('Token refresh');
        } catch (error) {
          console.error('Error refreshing token:', error);
          logout(); 
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
