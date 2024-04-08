import { Button } from '@mui/material';
import { OpenInFull } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const OpenThreadBtn = ({ threadId }) => {
    const navigate = useNavigate();
    return (
        <>
        <Button variant='contained' onClick={() => navigate(`/chatroom/${threadId}`)}>open</Button>
        </>
    )
};