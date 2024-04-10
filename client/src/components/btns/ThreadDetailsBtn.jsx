import { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { ThreadDetails } from "../messages/threadDetails";

export const ThreadDetailsBtn = ({ thread, currentUser }) => {
    const users = thread.participants;
    const [detailsToggled, setDetailsToggled] = useState(false);

    const toggleThreadDetails = () => {
        setDetailsToggled(!detailsToggled);
    }

    return (
        <>
            <Button 
                variant='contained' 
                sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}}
                onClick={toggleThreadDetails}
            >
                <Typography variant='h6'>{thread.name}</Typography>
            </Button>
            {detailsToggled && <ThreadDetails detailsToggled={detailsToggled} thread={thread} onClose={toggleThreadDetails} currentUser={currentUser}/>}
        </>
    )
};