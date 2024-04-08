import { Confirm } from "../forms/Confirm";
import { DeleteForever } from "@mui/icons-material";
import { Button } from '@mui/material';
import { DELETE_MESSAGE } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";

export const DeleteMessageBtn = ({ currentUser, messageId, refetch }) => {

    const [confirmOpen, setConfirmOpen] = useState(false);
    
    const [deleteMessage, { error }] = useMutation(DELETE_MESSAGE, {
        variables: { messageId },
        onCompleted: () => {
            refetch();
        }
    });

    const handleDeleteMessage = async () => {
        await deleteMessage()
    }
    return (
        <>
        <Button 
            variant='text' sx={{ p: 0 }} 
            onClick={() => setConfirmOpen(true)}
        >
            <DeleteForever sx={{fontSize: 30}}/>
        </Button>
        <Confirm confirmOpen={confirmOpen} setConfirmOpen={setConfirmOpen} action={'delete this message'} actionFunction={handleDeleteMessage}/>    
        </>
    )
};