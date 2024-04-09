import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { Box, Typography } from '@mui/material';
import { SideBarBtn } from '../components/btns/SideBarBtn';
import { CreateThreadBtn } from '../components/btns/CreateThreadBtn'
import MainPoll from '../components/Mainpoll'

function MessageHub() {
  const navigate = useNavigate();
  const { userId, friends, threads } = useUserContext();


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
        <MainPoll />
        <Box sx={{ overflowY: 'auto' }}>
            {threads && threads.map(thread => (
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