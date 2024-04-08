import { DeleteForever } from "@mui/icons-material";
import { Button } from '@mui/material';
import { DELETE_MESSAGE } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const DeleteMessageButton = ({ currentUser, messageId, refetch }) => {
    const [deleteMessage, { error }] = useMutation(DELETE_MESSAGE, {
        variables: { messageId },
        onCompleted: () => {
            refetch();
        }
    });

    const handleDeleteMessage = async () => {
        await deleteMessage()
    };
    useEffect(() => {
        const socket = io('http://localhost:3000');
        if (socket) {
            socket.on('message-deleted', handleDeleteMessage);
        }
        return () => socket.disconnect();
    }, [deleteMessage, messageId, refetch]);
    return (
        <>
        <Button variant='text' sx={{ p: 0 }} onClick={handleDeleteMessage}><DeleteForever sx={{fontSize: 30}}/></Button>      
        </>
    )
};