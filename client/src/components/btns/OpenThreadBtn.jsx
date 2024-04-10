import { Button } from '@mui/material';
import { OpenInFull } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const OpenThreadBtn = ({ threadId }) => {
    const navigate = useNavigate();
    return (
        <>
        <Button variant='contained' sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}} onClick={() => navigate(`/chatroom/${threadId}`)}>open</Button>
        </>
    )
};