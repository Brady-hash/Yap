import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import { Box, Typography } from '@mui/material';
import { SideBarBtn } from '../components/btns/SideBarBtn';
import { NavBar } from '../components/NavBar';
import { CreateThreadBtn } from '../components/btns/CreateThreadBtn'
import MainPoll from '../components/Mainpoll'

function MessageHub() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
      const handleResize = () => {
          setWindowWidth(window.innerWidth);
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  const isSmallScreen = windowWidth < 1000;
  const navigate = useNavigate();
  const { threads } = useUserContext();

  const navigateToThread = (threadId) => {
    navigate(`/chatroom/${threadId}`);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 10}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
            {!isSmallScreen ? 
                <NavBar />
                :
                <SideBarBtn />
            }
            <Box sx={{ width: 75, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <img
                    src="/Yap-Logo.png"
                    alt="Logo"
                    style={{ width: '100%', height: 'auto' }}
                />
            </Box>
        </Box>
        <Box sx={{ margin: 'auto', display:'flex', flexDirection:'column' }}>
            <MainPoll />
            <Box sx={{ flex: 1, overflowY: 'auto', mt: 1, ml: !isSmallScreen ? '14vw' : 0, mr: !isSmallScreen ? '14vw' : 0 }}>
                {threads && threads.map(thread => (
                    <Box 
                        key={thread._id} 
                        onClick={() => navigateToThread(thread._id)}
                        sx={{
                            borderRadius: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            cursor: 'pointer',
                            marginTop: 1,
                            marginLeft: 2,
                            marginRight: 2,
                            padding: 1
                        }}
                    >
                        <Typography 
                        variant="h5">{thread.name}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
        <Box sx={{  borderRadius: 3 , position: 'fixed', bottom: 15, right: 12 }}>
            <CreateThreadBtn />
        </Box>
    </Box>
);
}

export default MessageHub;