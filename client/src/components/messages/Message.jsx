import { Typography, Button, Avatar, Box, TextField } from "@mui/material";
import { PeopleOutline } from "@mui/icons-material";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_MESSAGE } from "../../utils/mutations";
import { DeleteMessageButton } from "./deleteMessage";
import { AddFriendButton } from "./addFriendButton";
import { EditMessageButton } from "./editMessageButton";
import { EditMessageBox } from "./editMessageBox";

export const Message = ({ message, currentUser, isAdmin, refetch }) => {
	
	const [currentMessage, setCurrentMessage] = useState(message.text);
	const [originalMessage, setOriginalMessage] = useState(currentMessage);
	const [isEditing, setIsEditing] = useState(false);
	const [updateMessage, { error }] = useMutation(UPDATE_MESSAGE);
	const [isFriend, setIsFriend] = useState(currentUser.friends.some(friend => friend._id === message.sender._id))

	const startEditing = () => {
		setOriginalMessage(currentMessage);
		setIsEditing(true);
	};

	const cancelEditing = () => {
		setCurrentMessage(originalMessage);
		setIsEditing(false);
	};

	const handleSaveEditedMessage = async () => {
		try {

			await updateMessage({
				variables: {
					messageId: message._id,
					text: currentMessage,
				},
				onCompleted: () => {
					refetch();
				}
			});
			setIsEditing(false);
		} catch(err) {
			console.log('error saving updated thread',err);
		}
	}

	const isCurrentUserMessage = message.sender._id === currentUser._id;
	let timestamp = message.timestamp.split('at')[0];
	
	// const isFriend = currentUser.friends.some(friend => friend._id === message.sender._id);

	return (

		<Box>
		<Box 
		sx={{ 
			border: 'solid #444 2px', 
			maxWidth: '80%',
			minHeight: '50px', 
			display: 'flex',
			flexDirection: 'column',
			boxShadow: 10,
			justifyContent: '',
			alignItems: isCurrentUserMessage ? 'end' : 'start',
			px: 1,
			marginBottom: 2,
			borderRadius: 3,
			marginLeft: isCurrentUserMessage ? 'auto' : 1,
			marginRight: isCurrentUserMessage ? 1 : 'auto', }}
		>
			<Box sx={{ width: '100%', height: '75px', display: 'flex', alignItems: 'start', position: 'relative'}}>
				<Avatar 
					src=''
					sx={{
						left: isCurrentUserMessage ? '' : 10,
						right: isCurrentUserMessage ? 10 : '',
						top: 15,
						position: 'absolute',
					}}
				/>

				<Typography 
					variant='span' 
					sx={{
						position: 'absolute',
						left: isCurrentUserMessage ? 0 : '',
						right: isCurrentUserMessage ? '' : 0,
						top: 10,
						color: 'white'
					}}
				> {timestamp}
				{ isAdmin || isCurrentUserMessage  ? <DeleteMessageButton messageId={message._id} currentUser={currentUser} refetch={refetch}/> : ''}
				{isCurrentUserMessage && <EditMessageButton onClick={startEditing}/>}
				</Typography>
			</Box>
			<Box sx={{ display: 'flex', gap: 0}}>
				<Typography variant='h4' sx={{color: '', textAlign: 'left', my: 1}}>{message.sender.username}</Typography>
				{!isCurrentUserMessage && !isFriend && <AddFriendButton currentUser={currentUser} friendId={message.sender._id} isFriend={isFriend} setIsFriend={setIsFriend}/>}
				{!isCurrentUserMessage && isFriend && <PeopleOutline sx={{fontSize: 30, color: 'gray', mx: 1}}/>}
			</Box>
			{isEditing ?  
				<EditMessageBox currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} cancelEditing={cancelEditing} handleSaveEditedMessage={handleSaveEditedMessage}/> 
				: 
				<Typography variant="span" sx={{color: 'white', pb: 2, px: 1, wordWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto'}}>{currentMessage}</Typography>
			}
		</Box>
		</Box>

	);
};

