import { useState } from "react";
import { Typography, Button } from "@mui/material";
import { ThreadDetails } from "../messages/threadDetails";
import { useThemeContext } from '../../context/ThemeContext';

export const ThreadDetailsBtn = ({ thread, currentUser }) => {
    const [detailsToggled, setDetailsToggled] = useState(false);
    const { theme } = useThemeContext();

    const toggleThreadDetails = () => {
        setDetailsToggled(!detailsToggled);
    }

    return (
        <>
            <Button 
                variant='contained' 
                onClick={toggleThreadDetails}
                sx={{ bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: theme.palette.secondary.main} }}
            >
                <Typography variant='h6'>{thread.name}</Typography>
            </Button>
            {detailsToggled && <ThreadDetails detailsToggled={detailsToggled} thread={thread} onClose={toggleThreadDetails} currentUser={currentUser}/>}
        </>
    )
};