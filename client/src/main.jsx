import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";

import App from './App.jsx';
import ChatRoom from './pages/Chatroom.jsx';
import MessageHub from './pages/MessageHub.jsx';
import MyProfile from './pages/MyProfile.jsx';
import NotFound from './pages/NotFound.jsx';
import LoginPage from './pages/LoginPage.jsx'
import './index.css';
import { useAuthContext } from "./context/AuthContext";


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <MessageHub /> },
      { path: "/myprofile", element: <MyProfile /> },
      { path: "/chatroom/:id", element: <ChatRoom /> },
      { path: "/login", element: <LoginPage /> },
      // { path: "/signup", element: <SignupPage /> }
    ]
  }
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
