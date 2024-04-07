import {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';
import { Box, Typography } from '@mui/material';
import { SideBarBtn } from '../components/btns/SideBarBtn';

import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function MessageHub() {
  const navigate = useNavigate();

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

  const navigateToThread = (threadId) => {
    navigate(`/chatroom/${threadId}`);
  };

  return (
    <Box>
      <SideBarBtn />
      {threads.map(thread => (
        <Box 
          key={thread._id} 
          onClick={() => navigateToThread(thread._id)}
          sx={{
            border: 2,
            borderColor: 'white',
            color: 'white',
            cursor: 'pointer',
            marginBottom: 1
          }}
        >
          <Typography variant="h5">{thread.name}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default MessageHub;