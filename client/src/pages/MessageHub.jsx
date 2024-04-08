import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';
import LogoutButton from '../components/LogoutButton';

import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function MessageHub() {
  const navigate = useNavigate();

  const { loading, data, error } = useQuery(QUERY_ME);
useEffect(() => {
    socket.on('thread-updated', handleThreadEvent);
    socket.on('thread-deleted', handleThreadEvent);
    socket.on('thread-created', handleThreadEvent);
    socket.on('message-added', handleThreadEvent);
    socket.on('message-updated', handleThreadEvent);
    socket.on('message-deleted', handleThreadEvent);
    socket.on('user-added', handleThreadEvent);
    socket.on('user-deleted', handleThreadEvent);
    socket.on('user-joined-thread', handleThreadEvent);
    socket.on('user-left-thread', handleThreadEvent);
  }, [socket]);
 

  const handleThreadEvent = () => {
    // refetch the user data
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const threads = data.me.messageThreads;
  const friends = data.me.friends;

  const handleThreadClick = (threadId) => {
    navigate(`/chatroom/${threadId}`);
  };

  return (
    <div>
      <LogoutButton />
      {threads.map(thread => (
        <div className="border-2 border-white text-red" key={thread._id} onClick={() => handleThreadClick(thread._id)}>
          
          <h1>{thread.name}</h1>
        </div>
      ))}
    </div>
  );
}

export default MessageHub;