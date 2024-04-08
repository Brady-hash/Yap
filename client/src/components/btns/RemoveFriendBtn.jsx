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
        <Button onClick={handleRemoveFriend}><PersonRemove sx={{fontSize: 30, color: '#761a1a'}}/></Button>
        </>
    )
};