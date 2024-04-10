import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_MESSAGE } from "../../utils/mutations";
import { Box, Button, TextField } from "@mui/material";
import { Send } from '@mui/icons-material/';
import { CreatePoll } from "./createPoll";
import { useChatroomContext } from "../../context/ChatroomContext";

const MessageInput = ({ thread }) => {

	const { userId, addToCombinedData, currentUserIsAdmin, combinedData } = useChatroomContext();

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
			console.log(err)
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
		<Box sx={{ 
			borderTopRightRadius: 10, 
			borderTopLeftRadius: 10, 
			boxShadow: '0px -5px 5px 0px rgba(0,0,0,0.3)', 
			height: modalOpen ? '60%' : '20%', 
			display: 'flex', 
			flexDirection: 'column', 
			justifyContent: 'center', 
			px: 2 }}>
		<Box
            sx={{
				position: 'relative',
				height: '100%',
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
					border: 'solid #555 2px',
					borderRadius: 2,
					boxShadow: 5,
					'& .MuiInputBase-input': {
					  color: 'white',
					},
				  }}
            />}
            
			<Box sx={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', gap: 2, height: '90%'}}>
				<Button variant="contained" color="primary" onClick={handleSubmit}>
                	<Send />
            	</Button>
				{currentUserIsAdmin ? 
					<Button variant="contained" color="primary" onClick={() => setModalOpen(!modalOpen)}>
						Poll
					</Button>
				: ''}
			</Box>
        </Box>
		</Box>
		</>
	);
};
export default MessageInput;