import { Container, Typography, Button, Avatar, Box } from "@mui/material";

export const Message = ({ message, currentUser }) => {
	const isCurrentUserMessage = message.sender._id === currentUser._id;
	let timestamp = message.timestamp.split('at');
	timestamp = timestamp[0];

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
			<Box sx={{ width: '100%', height: '50px', display: 'flex', alignItems: 'start', position: 'relative'}}>
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
				</Typography>
			</Box>
			<Typography variant='h4' sx={{color: '', textAlign: 'left', my: 2}}>{message.sender.username}</Typography>
			<Typography variant="span" sx={{color: 'white', pb: 2, px: 1}}>{message.text}</Typography>
		</Box>
		</Box>

	);
};

