import { AdminPanelSettings } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADMIN_USER } from "../../utils/mutations";

export const AddAdmin = ({ userId, threadId }) => {

    const [adminUser, { error }] = useMutation(ADMIN_USER);

    const handleAddAdmin = async () => {
        try {
            const { data } = await adminUser({
                variables: {
                    userId,
                    threadId
                }
            });
        } catch(err) {
            throw new Error(`Error adding admin: ${err}`);
        }
    }

    return (
        <>
        <Button 
            sx={{ position: 'absolute', right: 20}}
            onClick={handleAddAdmin}
        >+ Admin<AdminPanelSettings /></Button>
        </>
    )
};