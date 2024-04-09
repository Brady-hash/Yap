import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Confirm } from '../forms/Confirm';
import { DELETE_QUESTION } from '../../utils/mutations';
import { Button } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useChatroomContext } from '../../context/ChatroomContext';

export const DeletePollBtn = ({ poll }) => {

    const { removeFromCombinedData, combinedData } = useChatroomContext();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteQuestion, { error }] = useMutation(DELETE_QUESTION, {
        variables: { questionId: poll._id },
        onCompleted: () => {
            removeFromCombinedData(poll._id)
        }
    });

    const handleDeletePoll = async () => {
        await deleteQuestion(poll._id)
    }

    return (
        <>
        <Button 
            sx={{position: 'absolute', zIndex: 10, top: 3, right: 3}}
            onClick={() => setConfirmOpen(true)}
        >
            <DeleteForever sx={{fontSize: 30}}/>
        </Button>
        <Confirm confirmOpen={confirmOpen} setConfirmOpen={setConfirmOpen} action={'delete this poll'} actionFunction={handleDeletePoll}/>
        </>
    )
};