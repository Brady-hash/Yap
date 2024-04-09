// CreateThreadBtn.jsx
import { useState } from 'react';
import { Dialog } from '@mui/material';
import { AddCircle } from "@mui/icons-material";
import CreateThreadForm from '../forms/CreateThreadForm';


export const CreateThreadBtn = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <AddCircle 
            variant="outlined" 
            onClick={handleOpen}
            sx={{
                color: "white",
                fontSize:  "3rem",
                cursor: "pointer",
            }}
             />
            <Dialog open={open} onClose={handleClose}>
                <CreateThreadForm onClose={handleClose} />
            </Dialog>
        </>
    );
};
