import { Button } from "@mui/material";
import { PersonAddAlt } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { ADD_FRIEND } from "../../utils/mutations";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const AddFriendButton = ({ currentUser, friendId, isFriend, setIsFriend }) => {

    const [addFriend, { error }] = useMutation(ADD_FRIEND);
useEffect(() => {
    const socket = io('http://localhost:3000');
    const handleAddFriend = async () => {
        try {
            await addFriend({
                variables: {
                    userId: currentUser._id,
                    friendId: friendId,
                }
            });
            setIsFriend(true);
        } catch(err) {
            console.log('error adding friend', err);
        }
    };
    io.on('friend-added', handleAddFriend);
    return () => io.off('friend-added', handleAddFriend);
}
    ), [addFriend, currentUser._id, friendId, setIsFriend];


    return (
        <>
        <Button sx={{ p: 0 }} onClick={handleAddFriend}> <PersonAddAlt sx={{fontSize: 30}}/></Button>
        </>
    )
};