import {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';
import { Box, Typography } from '@mui/material';
import { SideBarBtn } from '../components/btns/SideBarBtn';
import { CreateThreadBtn } from '../components/btns/CreateThreadBtn'

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
    <Box sx={{ position: 'relative', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
            <SideBarBtn />
            <Box sx={{ width: 75, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <img
                    src="/Yap-Logo.png"
                    alt="Logo"
                    style={{ width: '100%', height: 'auto' }}
                />
            </Box>
        </Box>
        <Box sx={{ overflowY: 'auto' }}>
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
        <Box sx={{ position: 'fixed', bottom: 15, right: 12 }}>
            <CreateThreadBtn />
        </Box>
    </Box>
);
}


export default MessageHub;