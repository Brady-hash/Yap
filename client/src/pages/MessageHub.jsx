import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';


function MessageHub() {
  const { loading, data, error } = useQuery(QUERY_ME);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const threads = data.me.user.messageThreads;
  console.log(data.me.user);

  const handleThreadClick = (threadId) => {
    navigate(`/chatroom/${threadId}`);
  };

  return (
    <div>
      {threads.map(thread => (
        <div key={thread._id} onClick={() => handleThreadClick(thread._id)}>
          {thread.name}
        </div>
      ))}
    </div>
  );
}

export default MessageHub;
