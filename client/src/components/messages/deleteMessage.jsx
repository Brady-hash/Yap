import { DeleteForever } from "@mui/icons-material";
import { Button } from '@mui/material';
import { DELETE_MESSAGE } from "../../utils/mutations";
import { useMutation } from "@apollo/client";

export const DeleteMessageButton = ({ currentUser, messageId, refetch }) => {
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
        <Button variant='text' sx={{ p: 0 }} onClick={handleDeleteMessage}><DeleteForever sx={{fontSize: 30}}/></Button>      
        </>
    )
};