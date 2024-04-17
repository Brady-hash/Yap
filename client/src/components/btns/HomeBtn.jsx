import { Home } from "@mui/icons-material";
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/ThemeContext";

export const HomeBtn = () => {
    const navigate = useNavigate();
    const { theme } = useThemeContext();

    const handleClick = () => {
        navigate('/');
    }; 
    return (
        <Button 
            variant="contained"
            sx={{ bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: theme.palette.secondary.main} }}
        >
            <Home sx={{ fontSize: 35, color:"white" }}  onClick={handleClick}/>
        </Button>
    );
};