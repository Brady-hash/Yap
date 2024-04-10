import { Button, Box, TextField } from '@mui/material';
import { Edit, FmdBad } from '@mui/icons-material';
import { Confirm } from '../forms/Confirm';
import { AddToThreadBtn } from '../btns/AddToThreadBtn';
import { useMutation } from '@apollo/client';
import { UPDATE_THREAD, DELETE_THREAD } from '../../utils/mutations';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const EditThread = ({ threadId, name }) => {
    const navigate = useNavigate();
    const { removeThread } = useUserContext();

    const [updateThread, { error: updateThreadError }]= useMutation(UPDATE_THREAD);
    const [deleteThread, { error: deleteThreadError }] = useMutation(DELETE_THREAD);
    const [newNameValue, setNewNameValue] = useState(name)
    const [isEditing, setIsEditing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleUpdateThread = async () => {
        try {
            await updateThread({
                variables: {
                    name: newNameValue,
                    threadId
                }
            });
            setIsEditing(false);
        } catch(err) {
            throw new Error(`Error updating thread: ${err}`);
        }
    }

    const handleDeleteThread = async () => {
        try {
            const { data } = await deleteThread({
                variables: {
                    threadId
                }
            });
            removeThread(threadId)
            if (data.deleteThread.message === 'success') navigate('/')
        } catch(err) {
            throw new Error(`Error deleting thread: ${err}`);
        }
    }

    const handleInputChange = (event) => {
        setNewNameValue(event.target.value)
    }


    return (
        <>
        {isEditing ? 
        (
            
        <Box sx={{ position: 'fixed', bottom: 0, display: 'flex', width: '100%', p: 1, bgcolor: '#666'}}>
            <Box sx={{border: 'solid white 2px', width: '100%', p: 1 }}>
            <TextField
				focused={false}
                value={newNameValue}
				sx={{
					// border: 'solid #555 2px',
					borderRadius: 2,
					// boxShadow: 5,
                    width: '60%',
					'& .MuiInputBase-input': {
					  color: 'white',
					},
				  }}
                  onChange={handleInputChange}
            />
            <Box sx={{ display: 'flex', width: '60%', justifyContent: 'space-between', mt: 1}}>
                <Button variant='contained' sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}} onClick={() => setIsEditing(false)}>cancel</Button>
                <Button 
                    variant='contained' 
                    sx={{bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen'}}}
                    onClick={handleUpdateThread}
                >
                        save</Button>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Button 
                    variant='contained' 
                    sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred'}}}
                    onClick={() => setConfirmOpen(true)}
                >
                    delete thread</Button>

                <FmdBad sx={{ fontSize: 30, color: 'darkred', mx: 1 }}/>
            </Box>
            </Box>
        </Box>
        ) : (
        <Box sx={{ position: 'fixed', bottom: 0, display: 'flex', width: '80%', p: 1, bgcolor: '#666', justifyContent: 'space-between'}}>
            <Button variant='contained' sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}} onClick={() => setIsEditing(!isEditing)}>Edit Thread<Edit /></Button>
            <AddToThreadBtn />
        </Box>
        
        )}
        <Confirm confirmOpen={confirmOpen} setConfirmOpen={setConfirmOpen} action={'delete this thread'} actionFunction={handleDeleteThread}/>
        </>
    )
};