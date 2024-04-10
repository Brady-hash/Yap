/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { Typography, Button, Avatar, Box, TextField } from "@mui/material";
import { PeopleOutline } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_MESSAGE } from "../../utils/mutations";
import { useUserContext } from "../../context/UserContext";
import { DeleteMessageBtn } from "../btns/DeleteMessageBtn";
import { AddFriendBtn } from "../btns/AddFriendBtn";
import { EditMessageBtn } from "../btns/EditMessageBtn";
import { EditMessageBox } from "./editMessageBox";
import { UserProfile } from '../UserProfile';
import { useChatroomContext } from "../../context/ChatroomContext";

export const Message = ({ message, isAdmin, refetch }) => {

	const { friends, addFriend, removeFriend, threads, userId } = useUserContext();
	const { combinedData, updateCombinedData, threadData, currentUserIsAdmin } = useChatroomContext();
	
	const [currentMessage, setCurrentMessage] = useState(message.text);
	const [originalMessage, setOriginalMessage] = useState(currentMessage);
	const [isEditing, setIsEditing] = useState(false);
	const [updateMessage, { error }] = useMutation(UPDATE_MESSAGE);
	const [isFriend, setIsFriend] = useState(friends.some(friend => friend._id === message.sender._id));
	const [showUserProfileId, setShowUserProfileId] = useState(null);

	const isCurrentUserMessage = message.sender._id === userId;
	let timestamp = message.timestamp.split('at')[0];

	useEffect(() => {
		setIsFriend(friends.some(friend => friend._id === message.sender._id));
	}, [friends, message.sender._id]);
	

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
	
	return (

		<Box>
		<Box 
		sx={{ 
			background: 'black',
			opacity: .95,
			border: 'solid #444 2px', 
			maxWidth: '80%',
			minHeight: '50px', 
			display: 'flex',
			flexDirection: 'column',
			boxShadow: 10,
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
					onClick={() => setShowUserProfileId(message.sender._id)}
					sx={{
						left: isCurrentUserMessage ? '' : 10,
						right: isCurrentUserMessage ? 10 : '',
						top: 15,
						position: 'absolute',
						cursor: 'pointer'
					}}
				/>
				{showUserProfileId && (
                        <UserProfile 
                            userId={message.sender._id} 
							onClose={() => setShowUserProfileId(null)}
							/>
                    )}

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
				{ currentUserIsAdmin || isCurrentUserMessage  ? <DeleteMessageBtn messageId={message._id} refetch={refetch}/> : ''}
				{isCurrentUserMessage && <EditMessageBtn onClick={startEditing}/>}
				</Typography>
			</Box>
			<Box sx={{ display: 'flex', gap: 0}}>
				<Typography variant='h6' sx={{color: '#777', textAlign: 'left', my: 1}}>{message.sender.username}</Typography>
				{!isCurrentUserMessage && !isFriend && <AddFriendBtn friendId={message.sender._id}/>}
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

