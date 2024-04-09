// ChatroomWrapper.jsx
import React from 'react';
import { ChatroomProvider } from '../context/ChatroomContext';
import Chatroom from '../pages/Chatroom';

const ChatroomWrapper = () => {
  return (
    <ChatroomProvider>
      <Chatroom />
    </ChatroomProvider>
  );
};

export default ChatroomWrapper;
