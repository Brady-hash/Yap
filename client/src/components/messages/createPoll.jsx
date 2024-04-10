import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_QUESTION } from "../../utils/mutations";
import { TextField, Button, Box } from "@mui/material";
import { useChatroomContext } from "../../context/ChatroomContext";

export const CreatePoll = ({ userId, thread, modalOpen, onClose }) => {
    const { addToCombinedData, combinedData } = useChatroomContext();
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
        const [createQuestion, { data, loading, error }] = useMutation(CREATE_QUESTION, {
            variables: {
                text: formState.question,
                option1: formState.option1,
                option2: formState.option2,
                userId,
                messageThread: thread._id
            }, 
            onCompleted: (data) => {
                addToCombinedData(data.createQuestion);
                setFormState({ question: '', option1: '', option2: '' });
                onClose();
            },
        });

        const handleFormChange = (event) => {
            const { name, value } = event.target;
            setFormState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        };

        const handleSubmit = async (event) => {
            // event.preventDefault();
            try {
                await createQuestion();

            } catch(err) {
                console.log(err);
            }
            setFormState({ question: '', option1: '', option2: '' });
            onClose();
        }


    
    return (
        <>
        <Box sx={{ width: '100%', height: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, px: 1}}>
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
            <Button variant='contained' sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}} onClick={handleSubmit}>Ask Question</Button>
        </Box>
        </>
    )
};