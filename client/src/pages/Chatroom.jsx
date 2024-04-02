import React, { useState } from 'react';
import UserProfile from '../components/UserProfile';

function ChatRoom({ messages }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
  };

  const handleCloseUserProfile = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <span onClick={() => handleUserClick(message.userId)}>
            {message.userName}
          </span>
          : {message.text}
        </div>
      ))}
      {selectedUser && (
        <UserProfile 
          userId={selectedUser} 
          onClose={handleCloseUserProfile} 
        />
      )}
    </div>
  );
}

export default ChatRoom;
