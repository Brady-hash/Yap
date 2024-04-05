import { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { ThreadDetails } from "./threadDetails";

export const ThreadDetailsButton = ({ thread }) => {
    const users = thread.participants;
    console.log(users);
    const [detailsToggled, setDetailsToggled] = useState(false);

    const toggleThreadDetails = () => {
        setDetailsToggled(!detailsToggled);
    }

    return (
        <>
            <Button 
                variant='contained' 
                sx={{}}
                onClick={toggleThreadDetails}
            >
                <Typography variant='h5'>{thread.name}</Typography>
            </Button>
            {detailsToggled && <ThreadDetails detailsToggled={detailsToggled} thread={thread} onClose={toggleThreadDetails}/>}
        </>
    )
};