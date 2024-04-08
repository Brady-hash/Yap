// CreateThreadForm.jsx
import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_THREAD } from '../../utils/mutations';
import { Button, DialogTitle, DialogContent, TextField } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { useUserContext } from '../../context/UserContext';

const CreateThreadForm = ({ onClose }) => {
    const [threadName, setThreadName] = useState('');
    const [participantUsernames, setParticipantUsernames] = useState('');
    const { authUser } = useContext(AuthContext);
    const { addThread } = useUserContext(); 
    const navigate = useNavigate();

    const [createThread] = useMutation(CREATE_THREAD);

    const handleSubmit = async () => {
        const usernames = participantUsernames.split(',').map(name => name.trim());
        console.log(authUser);
            try {
            const { data } = await createThread({
                variables: {
                    userId: authUser.data._id,
                    name: threadName,
                    participantUsernames: usernames,
                }
            });
            if (data) {
                addThread(data.createThread)
                onClose();
                navigate(`/chatroom/${data.createThread._id}`)
            }
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    return (
        <>
            <DialogTitle>Create New Thread</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="normal"
                    id="threadName"
                    label="Thread Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={threadName}
                    onChange={e => setThreadName(e.target.value)}
                />
                <TextField
                    margin="normal"
                    id="participantUsernames"
                    label="Participants Usernames"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={participantUsernames}
                    onChange={e => setParticipantUsernames(e.target.value)}
                    helperText="Enter usernames separated by commas"
                />
                <Button color="primary" variant="contained" onClick={handleSubmit}>Submit</Button>
            </DialogContent>
        </>
    );
};

export default CreateThreadForm;
