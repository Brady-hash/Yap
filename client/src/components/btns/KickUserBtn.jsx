import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { KICK_USER } from '../../utils/mutations';
import { useChatroomContext } from '../../context/ChatroomContext';
import { Button } from '@mui/material';
import { Confirm } from '../forms/Confirm';

export const KickUserBtn = ({ userIdToKick, threadId }) => {
    const { removeParticipant } = useChatroomContext();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [kickUser, { loading, error }] = useMutation(KICK_USER, {
        variables: {
            userId: userIdToKick,
            threadId: threadId,
        },
        onCompleted: () => {
            removeParticipant(userIdToKick)
        }
    })
    return(
        <>
        <Button variant='text' onClick={() => setConfirmOpen(true)} sx={{ mx: 2, bgcolor: '#444', color: '#be3144', '&:hover': { color: 'darkred', bgcolor: '#444'}}}>Kick</Button>
        <Confirm confirmOpen={confirmOpen} setConfirmOpen={setConfirmOpen} action={'kick this user'} actionFunction={kickUser}/>
        </>
    )
};