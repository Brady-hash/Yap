import { Confirm } from "../forms/Confirm";
import { DeleteForever } from "@mui/icons-material";
import { DELETE_MESSAGE } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useChatroomContext } from "../../context/ChatroomContext";

export const DeleteMessageBtn = ({ messageId }) => {

    const { removeFromCombinedData } = useChatroomContext();
    const [confirmOpen, setConfirmOpen] = useState(false);
    
    const [deleteMessage, { error }] = useMutation(DELETE_MESSAGE, {
        variables: { messageId },
        onCompleted: () => {
            removeFromCombinedData(messageId)
        }
    });

    const handleDeleteMessage = async () => {
        await deleteMessage()
    }
    return (
        <>
            <DeleteForever 
                variant="text"
                sx={{ p: 0, fontSize: 30, color: '#be3144', cursor:'pointer' }}
                onClick={() => setConfirmOpen(true)}
            />
            <Confirm
                confirmOpen={confirmOpen}
                setConfirmOpen={setConfirmOpen}
                action="delete this message"
                actionFunction={handleDeleteMessage}
            />
        </>
    );
};