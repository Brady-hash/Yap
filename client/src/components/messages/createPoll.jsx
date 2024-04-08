import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { CREATE_QUESTION } from "../../utils/mutations";
import { FormGroup, TextField, Button, Box } from "@mui/material";
import {io} from 'socket.io-client';

export const CreatePoll = ({ currentUser, thread, modalOpen, onClose }) => {
        const styles = {
            borderRadius: 2,
            '& .MuiInputBase-input': {
                color: 'white',
            },
            '& .MuiInputLabel-root': {
                color: '#888',
            },
            '& .Mui-focused .MuiInputLabel-root': {
                color: '#999',
            },
            '& .MuiInput-underline:before': {
                borderBottomColor: 'gray', 
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: 'black',
            },
        }

        const [formState, setFormState] = useState({question: '', option1: '', option2: ''});
        const [createQuestion, { data, loading, error }] = useMutation(CREATE_QUESTION);
useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('question-added', (question) => {
        console.log('question added', question);
        // update the state with the new question
        const handleFormChange = (event) => {
            const { name, value } = event.target;
            setFormState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        };
    });
    return () => socket.disconnect();
}, [createQuestion]);
      

        const handleSubmit = async (event) => {
            // event.preventDefault();
            try {
                const { data } = await createQuestion({
                    variables: {
                        text: formState.question,
                        option1: formState.option1,
                        option2: formState.option2,
                        userId: currentUser._id,
                        messageThread: thread._id
                    }
                });
                console.log('data', data)

            } catch(err) {
                console.log(err);
            }
            setFormState({ question: '', option1: '', option2: '' });
            onClose();
        }


    
    return (
        <>
        <Box sx={{border: 'solid white 2px', width: '100%', height: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, px: 1}}>
            <TextField 
                name='question'
                multiline
                maxRows={2}
                label='Question'
                variant='standard'
                value={formState.question}
                onChange={handleFormChange}
                focused={false}
                sx={styles}
            />
            <TextField 
                name='option1'
                label='Option 1'
                value={formState.option1}
                onChange={handleFormChange}
                variant='standard'
                focused={false}
                sx={styles}
            />
            <TextField 
                name={'option2'}
                label='Option 2'
                value={formState.option2}
                onChange={handleFormChange}
                variant='standard'
                focused={false}
                sx={styles}
            />
            <Button variant='contained' onClick={handleSubmit}>Ask Question</Button>
        </Box>
        </>
    )
};