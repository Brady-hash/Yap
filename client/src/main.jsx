import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthContextProvider } from "./context/AuthContext.jsx";
import AuthWrapper from './components/AuthWrapper.jsx'
import { SocketContextProvider } from "./context/SocketContext.jsx";

import App from './App.jsx';
import ChatRoom from './pages/Chatroom.jsx';
import MessageHub from './pages/MessageHub.jsx';
import MyProfile from './pages/MyProfile.jsx';
import NotFound from './pages/NotFound.jsx';
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './components/SignupForm.jsx'
import './index.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <AuthWrapper><MessageHub /></AuthWrapper> },
      { path: '/myprofile', element: <AuthWrapper><MyProfile /></AuthWrapper> },
      { path: '/chatroom/:threadId', element: <AuthWrapper><ChatRoom /></AuthWrapper> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <RouterProvider router={router} />
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);