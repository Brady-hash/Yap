import { Button } from '@mui/material';
import { useUserContext } from '../../context/UserContext';
import { useMutation } from '@apollo/client';
import { JOIN_THREAD } from '../../utils/mutations';

export const JoinThreadBtn = ({ threadId }) => {
    const { userId, threads, addThread } = useUserContext();
    const [joinThread, { error }] = useMutation(JOIN_THREAD);
    
    const handleJoinThread = async () => {
        try {
            const { data } = await joinThread({
                variables: {
                    userId,
                    threadId
                }
            })
            if (data.joinThread) {
                addThread(data.joinThread)
            }
        } catch(err) {
            throw new Error(`Error joining thread: ${err}`);
        }
    }
    return (
        <>
        <Button variant='text' sx={{ color: '#222', bgcolor: '#444', '&:hover': { bgcolor: '#444', color: '#777'}}} onClick={handleJoinThread}>join</Button>
        </>
    )
};