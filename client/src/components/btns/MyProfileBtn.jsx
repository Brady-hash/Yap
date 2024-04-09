import { Person2Outlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MyProfileBtn = () => {
    const navigate = useNavigate();

    const navigateToMyProfile = () => {
        navigate('/myprofile');
    };
    
	return (
        <Person2Outlined sx={{ fontSize: 30, color: "white", cursor: "pointer"  }} onClick={navigateToMyProfile} />
    );

};

export default MyProfileBtn;