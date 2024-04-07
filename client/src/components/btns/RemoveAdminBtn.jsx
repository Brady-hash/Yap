import { RemoveModerator } from "@mui/icons-material";
import { Button } from '@mui/material';
import { REMOVE_ADMIN } from "../../utils/mutations";
import { useMutation } from "@apollo/client";

export const RemoveAdminBtn = ({ userId, threadId }) => {

    const [removeAdmin, { error }] = useMutation(REMOVE_ADMIN);

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
            onClick={handleRemoveAdmin}
        ><RemoveModerator /></Button>
        </>
    )
};