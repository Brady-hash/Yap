import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    }; 
    return (
        <Button variant='contained' sx={{minWidth: '50px', height: '50px'}} onClick={handleClick}>
            <ArrowBack sx={{ fontSize: 35 }} />
        </Button>
    );
};