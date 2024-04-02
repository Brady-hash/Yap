import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx'
import './index.css'
import ChatRoom from './pages/Chatroom.jsx';
import MessageHub from './pages/MessageHub.jsx';
import MyProfile from './pages/MyProfile.jsx';

const router = createBrowserRouter({
  routes: [
    {
      path: '/',
      element: <APP />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <MessageHub />
        },
        {
          path: "/myprofile",
          element: <MyProfile />
        },
        {
          path: "chatroom/:id",
          element: <ChatRoom />
        }
      ]
    }
  ],
});



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
