import { MeetingRoom } from "@mui/icons-material";
import { Button } from "@mui/material";

export const LeaveThreadButton = ({ sx }) => {
    return (
        <>
            <Button variant='contained' sx={sx}><MeetingRoom sx={{ fontSize: 35 }}/></Button>
        </>
    )
};