import { MeetingRoom } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LEAVE_THREAD } from '../../utils/mutations';

export const LeaveThreadBtn= ({ sx, thread }) => {

    console.log(thread)

    const navigate = useNavigate();

    const [leaveThread, { error }] = useMutation(LEAVE_THREAD, {
        onCompleted: () => {
            navigate('/');
        }
    });

    const handleLeaveThread = async () => {
        try {
            await leaveThread({
                variables: {
                    threadId: thread._id,
                }
            })
        } catch(err) {
            throw new Error(`Error leaving thread: ${err}`);
        }
    }
    return (
        <>
            <Button 
                variant='contained' 
                sx={sx}
                onClick={handleLeaveThread}
            >
                <MeetingRoom sx={{ fontSize: 35 }}/>
            </Button>
        </>
    )
};