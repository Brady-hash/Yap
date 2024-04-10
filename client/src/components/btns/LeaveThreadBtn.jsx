import { Confirm } from "../forms/Confirm";
import { MeetingRoom } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LEAVE_THREAD } from '../../utils/mutations';
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";

export const LeaveThreadBtn= ({ sx, thread }) => {
    const { removeThread } = useUserContext();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const navigate = useNavigate();

    const [leaveThread, { error }] = useMutation(LEAVE_THREAD, {
        // onCompleted: () => {
        //     navigate('/');
        // }
    });

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
                sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}}
                onClick={()=> setConfirmOpen(true)}
            >
                <MeetingRoom sx={{ fontSize: 35 }}/>
            </Button>
            <Confirm confirmOpen={confirmOpen} setConfirmOpen={setConfirmOpen} action={'leave this thread'} actionFunction={handleLeaveThread}/>
        </>
    )
};