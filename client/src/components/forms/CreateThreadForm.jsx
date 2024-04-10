// CreateThreadForm.jsx
import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_THREAD } from '../../utils/mutations';
import { Button, DialogTitle, DialogContent, TextField, Box } from '@mui/material';
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
        <Box sx={{ bgcolor: '#121212', color: 'white', p: 3}}>
            <DialogTitle sx={{ color: 'white' }}>Create New Thread</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="threadName"
                    label="Thread Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={threadName}
                    onChange={e => setThreadName(e.target.value)}
                    InputLabelProps={{ style: { color: '#aaa' } }}
                    sx={{ 
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiOutlinedInput-root': { 
                            '& fieldset': { borderColor: '#666' },
                            '&:hover fieldset': { borderColor: '#888' },
                        },
                        marginBottom: 2
                    }}
                />
                <TextField
                    margin="dense"
                    id="participantUsernames"
                    label="Participants Usernames"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={participantUsernames}
                    onChange={e => setParticipantUsernames(e.target.value)}
                    helperText="Enter usernames separated by commas"
                    InputLabelProps={{ style: { color: '#aaa' } }}
                    FormHelperTextProps={{ style: { color: '#aaa' } }}
                    sx={{ 
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiOutlinedInput-root': { 
                            '& fieldset': { borderColor: '#666' },
                            '&:hover fieldset': { borderColor: '#888' },
                        }
                    }}
                />
                <Button 
                    color="primary" 
                    variant="contained" 
                    disabled={!threadName}
                    onClick={handleSubmit} 
                    sx={{ 
                        marginTop: 2, 
                        bgcolor: '#333', 
                        '&:hover': { bgcolor: '#444' } 
                    }}
                >
                    Submit
                </Button>
            </DialogContent>
        </Box>
    );
};

export default CreateThreadForm;
