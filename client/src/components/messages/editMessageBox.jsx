import { Box, TextField, Button } from '@mui/material';
import { DoneAll, Close } from '@mui/icons-material';

export const EditMessageBox = ({ currentMessage, setCurrentMessage, cancelEditing, handleSaveEditedMessage }) => {

    const handleInputChange = (event) => {
		setCurrentMessage(event.target.value);
	};

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