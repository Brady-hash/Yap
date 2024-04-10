import { ArrowBack } from "@mui/icons-material";
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export const BackBtn = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    }; 
    return (
        <Button sx={{ '&:hover': { bgcolor: 'transparent'}}}>
            <ArrowBack sx={{ fontSize: 35, color:"white" }}  onClick={handleClick}/>
        </Button>
    );
};