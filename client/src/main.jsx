import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from './theme/theme.js'

import { AuthContextProvider } from "./context/AuthContext.jsx";
import AuthWrapper from './components/AuthWrapper.jsx'

import App from './App.jsx';
import ChatRoom from './pages/Chatroom';
import ChatroomWrapper from './context/ChatroomWrapper.jsx';
import MessageHub from './pages/MessageHub';
import MyProfile from './pages/MyProfile';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import './index.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <AuthWrapper><MessageHub /></AuthWrapper> },
      { path: '/myprofile', element: <AuthWrapper><MyProfile /></AuthWrapper> },
      { path: '/chatroom/:threadId', element: <AuthWrapper><ChatroomWrapper /></AuthWrapper> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={darkTheme}> */}
      <AuthContextProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </AuthContextProvider>
    {/* </ThemeProvider> */}
  </React.StrictMode>
);