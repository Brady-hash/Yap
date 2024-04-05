import { Container, Typography, Button, Avatar, Box } from "@mui/material";

export const Message = ({ message, currentUser, }) => {
	console.log(message.timestamp.split('PM'))

	const isCurrentUserMessage = message.sender._id === currentUser._id;
	let timestamp = message.timestamp.split('PM');
	timestamp = timestamp[0];

	return (

		<Box>
		<Container 
		disableGutters
		sx={{ 
			border: 'solid white 2px', 
			maxWidth: '80%',
			minHeight: '50px', 
			display: 'flex',
			flexDirection: 'column',
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
						top: 5,
						position: 'absolute',
					}}
				/>

				<Typography 
					variant='span' 
					sx={{
						position: 'absolute',
						left: isCurrentUserMessage ? 0 : '',
						right: isCurrentUserMessage ? '' : 0,
						top: 5,
						color: 'white'
					}}
				> {timestamp}
				</Typography>
			</Box>
			<Typography variant="span" sx={{color: 'white'}}>{message.text}</Typography>
		</Container>
		</Box>

	);
};

