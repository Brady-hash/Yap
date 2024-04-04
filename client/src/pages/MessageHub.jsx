import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';

import  AuthService from '../utils/auth'
import { useAuthContext } from '../context/AuthContext';

import io from 'socket.io-client';

function MessageHub() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  if (!authUser) {
    AuthService.redirectToLogin();
    return null;
  };

  const { loading, data, error } = useQuery(QUERY_ME);

  useEffect(() => {
    // listen for 'thread-updated' event
    socket.on('thread-updated', handleThreadEvent);
    // listen for 'thread-deleted' event
    socket.on('thread-deleted', handleThreadEvent);
    // listen for 'thread-created' event
    socket.on('thread-created', handleThreadEvent);
    return () => {
      // remove event listeners
      socket.off('thread-updated', handleThreadEvent);
      socket.off('thread-deleted', handleThreadEvent);
      socket.off('thread-created', handleThreadEvent);
    };
  }, []);

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
      {threads.map(thread => (
        <div className="border-2 border-white text-red" key={thread._id} onClick={() => handleThreadClick(thread._id)}>
          
          <h1>{thread.name}</h1>
        </div>
      ))}
    </div>
  );
}

export default MessageHub;