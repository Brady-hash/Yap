import { Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuthContext } from '../../context/AuthContext';

const LogoutBtn = () => {
	const { loading, logout } = useAuthContext();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

    return (
        <Button sx={{ p: 0 }} onClick={handleLogout}><Logout sx={{ fontSize: 30, color: "white" }}/></Button>
    );
}; 

export default LogoutBtn;