import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_MESSAGE } from "../../utils/mutations";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Send } from '@mui/icons-material/';
import { CreatePoll } from "./createPoll";
import { useChatroomContext } from "../../context/ChatroomContext";
import { useThemeContext } from "../../context/ThemeContext";

const MessageInput = ({ thread }) => {

	const { userId, addToCombinedData, currentUserIsAdmin, combinedData } = useChatroomContext();
	const { theme } = useThemeContext();

	const [message, setMessage] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [addMessage, { error }] = useMutation(ADD_MESSAGE, {
		variables: {
			text: message,
			userId,
			threadId: thread._id,
		},
	});

	const handleInputChange = (event) => {
		setMessage(event.target.value);
	};

	const scrollToBottom = () => {
		const messageContainer = document.getElementById('messageContainer');
		if (messageContainer) {
		  setTimeout(() => {
			messageContainer.scrollTo(0, messageContainer.scrollHeight);
		  }, 100);
		}
	  };

	const handleSubmit = async (event) => {
		try {
			if (!message.trim()) {
				return
			} 
			const { data } = await addMessage();
			if (data) {
				addToCombinedData(data.addMessage)
				scrollToBottom();
			}
			setMessage('')
		} catch(err) {
			`Error sending message: ${err}`;
			console.error(err)
		}
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}


	return (
		<>
		<Box
            sx={{
				position: 'relative',
				pt: 4,
				pb: 2,
                display: 'flex',
                alignItems: 'center',
				justifyContent: 'center',
                gap: 1,
            }}
        >
			{modalOpen ? <CreatePoll thread={thread} userId={userId} modalOpen={modalOpen} onClose={() => setModalOpen(false)}/> : 
			
			<TextField
                fullWidth
                // variant="outlined"
				multiline
				minRows={2}
				maxRows={4}
				focused={false}
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				sx={{
					maxWidth: 'xl',
					// border: 'solid #555 2px',
					borderRadius: 2,
					boxShadow: 5,
					'& .MuiInputBase-input': {
						color: theme.palette.text.primary, // Ensure input text color inherits from the main color style
					  }
				  }}
            />}
            
			<Box sx={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', gap: 2, height: '90%'}}>
				<Button variant="contained" onClick={handleSubmit} disabled={!message} sx={{ bgcolor: theme.palette.utility.main, '&:hover': { bgcolor: theme.palette.utility.secondary }}}>
                	<Send sx={{ color: theme.palette.utility.contrastText, }}/>
            	</Button>
				{currentUserIsAdmin ? 
					<Button variant="contained" onClick={() => setModalOpen(!modalOpen)} sx={{ bgcolor: theme.palette.utility.main, '&:hover': { bgcolor: theme.palette.utility.secondary } }}>
						    <Typography sx={{ color: theme.palette.utility.contrastText }}>
      							Poll
    						</Typography>
					</Button>
				: ''}
			</Box>
        </Box>
		</>
	);
};
export default MessageInput;