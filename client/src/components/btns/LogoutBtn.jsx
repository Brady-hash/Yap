import { Button, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuthContext } from '../../context/AuthContext';

const LogoutBtn = ({ sx }) => {
	const { loading, logout } = useAuthContext();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

    return (
        <Button 
			variant='contained' 
			onClick={handleLogout}
			// sx={{ bgcolor: '#222831', right: 10, '&:hover': { bgcolor: '#455d7a'}}}
			sx={sx}
		>
			<Typography variant='h7'>Logout</Typography>
			<Logout sx={{ fontSize: 30, color: "white", marginLeft: 1 }} />
		</Button>
    );
}; 

export default LogoutBtn;