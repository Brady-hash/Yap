import { Button } from "@mui/material";
import { PersonAddAlt } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { ADD_FRIEND } from "../../utils/mutations";
import { useUserContext } from "../../context/UserContext";

export const AddFriendBtn = ({ friendId, sx }) => {

    const { addFriend, userId } = useUserContext();
    // console.log(friends)

    const [addFriendtoDatabase, { error }] = useMutation(ADD_FRIEND);

    const handleAddFriend = async () => {
        try {
            await addFriendtoDatabase({
                variables: {
                    userId,
                    friendId: friendId,
                }
            });
            addFriend(friendId)
        } catch(err) {
            console.log('error adding friend', err);
        }
    }

    return (
        <>
        <Button variant='contained' sx={sx} onClick={handleAddFriend}> <PersonAddAlt sx={{fontSize: 25, color: 'white'}}/></Button>
        </>
    )
};