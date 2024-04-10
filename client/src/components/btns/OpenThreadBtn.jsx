import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const OpenThreadBtn = ({ threadId }) => {
    const navigate = useNavigate();
    return (
        <>
        <Button variant='contained' sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}} onClick={() => navigate(`/chatroom/${threadId}`)}>open</Button>
        </>
    )
};