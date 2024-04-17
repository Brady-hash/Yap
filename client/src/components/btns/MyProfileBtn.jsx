import { Button, Typography } from '@mui/material';
import { Person2Outlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from '../../context/ThemeContext';

const MyProfileBtn = ({ sx }) => {
    const navigate = useNavigate();
    const { theme } = useThemeContext();

    const navigateToMyProfile = () => {
        navigate('/myprofile');
    };
    
	return (
        <Button 
            variant='contained' 
            onClick={navigateToMyProfile} 
            sx={{ 				
                height: '50px',
                bgcolor: theme.palette.primary.main,
                bgcolor: theme.palette.primary.main, 
                '&:hover': { bgcolor: theme.palette.secondary.main}
            }}
        >
            <Typography variant='h7'>Profile</Typography>
            <Person2Outlined sx={{ fontSize: 30, color: "white", marginLeft: 1 }}/>
        </Button>
    );

};

export default MyProfileBtn;