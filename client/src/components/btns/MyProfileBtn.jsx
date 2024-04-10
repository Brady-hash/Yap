import { Button, Typography } from '@mui/material';
import { Person2Outlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MyProfileBtn = ({ sx }) => {
    const navigate = useNavigate();

    const navigateToMyProfile = () => {
        navigate('/myprofile');
    };
    
	return (
        <Button 
            variant='contained' 
            onClick={navigateToMyProfile} 
            sx={sx}
        >
            <Typography variant='h7'>Profile</Typography>
            <Person2Outlined sx={{ fontSize: 30, color: "white", marginLeft: 1 }}/>
        </Button>
    );

};

export default MyProfileBtn;