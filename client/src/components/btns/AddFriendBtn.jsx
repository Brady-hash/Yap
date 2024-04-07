import { Button } from "@mui/material";
import { PersonAddAlt } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { ADD_FRIEND } from "../../utils/mutations";

export const AddFriendBtn = ({ currentUser, friendId, isFriend, setIsFriend }) => {

    const [addFriend, { error }] = useMutation(ADD_FRIEND);

    const handleAddFriend = async () => {
        try {
            await addFriend({
                variables: {
                    userId: currentUser._id,
                    friendId: friendId,
                }
            });
            setIsFriend(true)
        } catch(err) {
            console.log('error adding friend', err);
        }
    }

    return (
        <>
        <Button sx={{ p: 0 }} onClick={handleAddFriend}> <PersonAddAlt sx={{fontSize: 30}}/></Button>
        </>
    )
};