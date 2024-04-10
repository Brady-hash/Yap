import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useChatroomContext } from '../../context/ChatroomContext';
import { useUserContext } from '../../context/UserContext';
import { useMutation } from '@apollo/client';
import { ADD_USER_TO_THREAD } from '../../utils/mutations';

export const AddToThreadForm = ({ formOpen, setFormOpen }) => {
    const { friends, userId } = useUserContext();
    const { thread, addParticipant } = useChatroomContext();

    const [addUserToThread, { error }] = useMutation(ADD_USER_TO_THREAD)

    const handleAddUser = async (friendId) => {
        try {
            await addUserToThread({
                variables: {
                    userId: friendId,
                    threadId: thread._id
                }
            })
        } catch(err) {
            throw new Error(`Error adding to thread: ${err}`);
        }
    }

    const isFriendParticipant = (friendId, thread) => {
        return thread.participants.some(participant => participant._id === friendId);
    };

    return (
<>
        <Dialog 
            open={formOpen}
            maxWidth='xl'
            fullWidth={true}
        >
            <DialogTitle sx={{ bgcolor: '#333', color: 'white'}}>Add friends to your thread!</DialogTitle>
            <DialogContent sx={{ overflowY: 'auto', bgcolor: '#444'}}>
                {friends.map(friend => (
                    <Box 
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: 'solid #666 2px ',
                            py: 1
                        }}
                        key={friend._id}>
                        <Typography variant='h4' sx={{ color: 'white'}}>{friend.username}</Typography>
                        {isFriendParticipant(friend._id, thread) ? '(member)' : 
                            <Button 
                                variant='contained'
                                sx={{ bgcolor: 'green', '&:hover': { bgcolor: '#455d7a'}}}
                                onClick={() => handleAddUser(friend._id)}
                            >
                                Add</Button>
                        }
                    </Box>
                ))}
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#444'}}>
                <Button 
                    variant='contained' 
                    onClick={() => setFormOpen(false)}
                    sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
};