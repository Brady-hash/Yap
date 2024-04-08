import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_MESSAGE } from "../../utils/mutations";
import { Box, Button, TextField } from "@mui/material";
import { Send } from '@mui/icons-material/';
import { CreatePoll } from "./createPoll";
import {io} from 'socket.io-client';

const socket = io('http://localhost:3000');

const MessageInput = ({ currentUser, thread }) => {

	// console.log(currentUser)
	// console.log(thread.admins)

	const isAdmin = thread.admins.some(admin => admin._id.toString() === currentUser._id.toString());
	
	const [message, setMessage] = useState('');
	const [addMessage, { error }] = useMutation(ADD_MESSAGE);
	const [currentMessages, setCurrentMessages] = useState(thread.messages);
	const [modalOpen, setModalOpen] = useState(false);

	const handleInputChange = (event) => {
		setMessage(event.target.value);
	};

	useEffect(() => {
		const messageContainer = document.getElementById('messageContainer');
		messageContainer.scrollTo(0, messageContainer.scrollHeight);
	}, [currentMessages])

	const handleSubmit = async (event) => {
		try {
			if (!message.trim()) {
				return
			} 
			const { data } = await addMessage({
				variables: {
					text: message,
					userId: currentUser._id,
					threadId: thread._id,
				}
			});
			if (data && data.addMessage) {
				const newMessage = data.addMessage.messages[data.addMessage.messages.length - 1];
				setCurrentMessages(currentMessages => [...currentMessages, newMessage]);
				setMessage('');
			}
			console.log(data)

		} catch(err) {
			`Error sending message: ${err}`;
			console.log(err)
		}
	}
useEffect(() => {
	socket.on('message-added', (message) => {
		setCurrentMessages(currentMessages => [...currentMessages, message]);
	});
	return () => socket.disconnect();
}, [socket]);

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
			{modalOpen ? <CreatePoll thread={thread} currentUser={currentUser} modalOpen={modalOpen} onClose={() => setModalOpen(false)}/> : 
			
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
				{isAdmin ? 
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