import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const BackBtn = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    }; 
    return (

            <ArrowBack sx={{ fontSize: 35, color:"white"}}  onClick={handleClick}/>
    );
};