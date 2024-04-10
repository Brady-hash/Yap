import { RemoveModerator } from "@mui/icons-material";
import { Button } from '@mui/material';
import { Confirm } from "../forms/Confirm";
import { REMOVE_ADMIN } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";

export const RemoveAdminBtn = ({ userId, threadId }) => {

    const [removeAdmin, { error }] = useMutation(REMOVE_ADMIN);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleRemoveAdmin = async () => {
        try {
            const { data } = await removeAdmin({
                variables: {
                    userId,
                    threadId
                }
            });
            console.log(data)
        } catch(err) {
            throw new Error(`Error removing admin: ${err}`);
        }
    }
    return (
        <>
        <Button
            onClick={() => setConfirmOpen(true)}
            sx={{ marginLeft: 2, bgcolor: '#222831', '&:hover': { bgcolor: '#be3144'}}}
        ><RemoveModerator sx={{ fontSize: 30, color: 'white' }}/></Button>
        <Confirm confirmOpen={confirmOpen} setConfirmOpen={setConfirmOpen} action={'remove this users privileges'} actionFunction={handleRemoveAdmin}/>
        </>
    )
};