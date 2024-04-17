import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { Box, Typography } from '@mui/material';
import { CreateThreadBtn } from '../components/btns/CreateThreadBtn'
import MainPoll from '../components/Mainpoll';

function MessageHub() {

  const navigate = useNavigate();
  const { threads } = useUserContext();

  const navigateToThread = (threadId) => {
    navigate(`/chatroom/${threadId}`);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 10, pt: 20 }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
            <Box sx={{ width: 75, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <img
                    src="/Yap-Logo.png"
                    alt="Logo"
                    style={{ width: '100%', height: 'auto' }}
                />
            </Box>
        </Box> */}
        <Box sx={{ margin: 'auto', display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
            <MainPoll />
            <Box sx={{ flex: 1, overflowY: 'auto', mt: 1, width: '100%', maxWidth: 'md'}}>
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