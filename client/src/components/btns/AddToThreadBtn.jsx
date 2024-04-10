import { Button } from '@mui/material';
import { useState } from 'react';
import { AddToThreadForm } from '../forms/AddToThreadForm';

export const AddToThreadBtn = () => {
    const [formOpen, setFormOpen] = useState(false)
    return (
        <>
        <Button variant='contained' sx={{ mx: 2, bgcolor: '#222831', color: 'green', '&:hover': { color: 'white', bgcolor: '#455d7a'}}} onClick={() => setFormOpen(true)}>add friends</Button>
        {formOpen && <AddToThreadForm formOpen={formOpen} setFormOpen={setFormOpen}/>}
        </>
    )
}