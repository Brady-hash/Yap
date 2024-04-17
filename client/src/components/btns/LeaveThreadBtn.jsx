import { Confirm } from "../forms/Confirm";
import { MeetingRoom } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LEAVE_THREAD } from '../../utils/mutations';
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { useThemeContext } from "../../context/ThemeContext";

export const LeaveThreadBtn= ({ sx, thread }) => {
    const { removeThread } = useUserContext();
    const { theme } = useThemeContext();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const navigate = useNavigate();

    const [leaveThread, { error }] = useMutation(LEAVE_THREAD);

    const handleLeaveThread = async () => {
        try {
            const { data } = await leaveThread({
                variables: {
                    threadId: thread._id,
                }
            });
            if (data) {
                removeThread(thread._id);
                navigate('/')
            }
        } catch(err) {
            throw new Error(`Error leaving thread: ${err}`);
        }
    }
    return (
        <>
            <Button 
                variant='contained' 
                onClick={()=> setConfirmOpen(true)}
                sx={{ bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: theme.palette.secondary.main} }}
            >
                <MeetingRoom sx={{ fontSize: 35 }}/>
            </Button>
            <Confirm confirmOpen={confirmOpen} setConfirmOpen={setConfirmOpen} action={'leave this thread'} actionFunction={handleLeaveThread}/>
        </>
    )
};