import { Button } from '@mui/material';
import { PersonRemove } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { REMOVE_FRIEND } from '../../utils/mutations';
import { useUserContext } from '../../context/UserContext';

export const RemoveFriendBtn = ({ friendId, setIsFriend }) => {
    const [removeFriendFromDatabase, { error }] = useMutation(REMOVE_FRIEND);
    const { removeFriend, userId } = useUserContext();

    const handleRemoveFriend = async () => {
        try {
            await removeFriendFromDatabase({
                variables: {
                    userId,
                    friendId
                }
            });
            removeFriend(friendId)
            setIsFriend(false)
        } catch(err) {
            throw new Error(`Error removing friend :${err}`);
        }
    }
    return (
        <>
        <Button variant='contained' onClick={handleRemoveFriend} sx={{ position:'absolute', right: 10, marginLeft: 2, bgcolor: '#be3144', '&:hover': { bgcolor: '#e84a5f' }}} ><PersonRemove sx={{fontSize: 25, color: 'white'}}/></Button>
        </>
    )
};