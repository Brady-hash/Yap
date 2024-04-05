import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";

export const BackButton = () => {
    return (
        <>
        <Button variant='contained' sx={{minWidth: '50px', height: '50px'}}> <ArrowBack sx={{ fontSize: 35 }}/></Button>
        </>
    )
};