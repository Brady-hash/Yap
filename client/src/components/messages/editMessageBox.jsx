import { Box, TextField, Button } from '@mui/material';
import { DoneAll, Close } from '@mui/icons-material';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const EditMessageBox = ({ currentMessage, setCurrentMessage, cancelEditing, handleSaveEditedMessage }) => {
const socket = io('http://localhost:3000');
    const handleInputChange = (event) => {
		setCurrentMessage(event.target.value);
	};
    useEffect(() => {
        if (socket) {
            socket.on('message-updated', handleSaveEditedMessage);
        }
        return () => socket.disconnect();
    }, [currentMessage, handleSaveEditedMessage]);

    return (
        <>
        <Box sx={{width: '100%', display: 'flex'}}>
        <TextField
                // variant="outlined"
				multiline
				minRows={2}
				maxRows={4}
				focused={false}
                placeholder="Type a message..."
                value={currentMessage}
                onChange={handleInputChange}
				sx={{
					border: 'solid #555 2px',
					borderRadius: 2,
					boxShadow: 5,
                    width: '85%',
                    mb: 2,
					'& .MuiInputBase-input': {
					  color: 'white',
					},
				  }}
            />
            <Box sx={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', gap: 1}}>
                <Button onClick={handleSaveEditedMessage}><DoneAll sx={{fontSize: 30, p: 0}}/></Button>
                <Button onClick={cancelEditing}><Close sx={{fontSize: 30, p: 0}}/></Button>
            </Box>
            </Box>
        </>
    )
};