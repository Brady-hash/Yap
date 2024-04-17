import { Button, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';

const LogoutBtn = ({ sx }) => {
	const { loading, logout } = useAuthContext();
	const { theme, mode, toggleTheme } = useThemeContext();

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
			sx={{
				height: '50px',
				bgcolor: theme.palette.danger.primary, 
				'&:hover': {
					bgcolor: theme.palette.danger.secondary
				},
			}}
		>
			<Typography variant='h7'>Logout</Typography>
			<Logout sx={{ fontSize: 30, color: "white", marginLeft: 1 }} />
		</Button>
    );
}; 

export default LogoutBtn;