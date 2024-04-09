import { Button } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
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
        <Button variant='text' onClick={handleJoinThread}>join</Button>
        </>
    )
};