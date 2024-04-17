import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_QUESTION } from "../../utils/mutations";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useChatroomContext } from "../../context/ChatroomContext";
import { useThemeContext } from "../../context/ThemeContext";

export const CreatePoll = ({ userId, thread, modalOpen, onClose }) => {
    const { addToCombinedData, combinedData } = useChatroomContext();
    const { theme } = useThemeContext();
        const styles = {
            borderRadius: 2,
            width: '100%',
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
                console.error(err);
            }
            setFormState({ question: '', option1: '', option2: '' });
            onClose();
        }


    
    return (
        <>
        <Box sx={{ width: '100%', height: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, px: 1}}>
            <TextField 
                name='question'
                multiline
                maxRows={2}
                label='Question'
                variant='standard'
                value={formState.question}
                onChange={handleFormChange}
                focused={false}
                sx={{
                    ...styles,
                    '& .MuiInputBase-input': {
						color: theme.palette.text.primary, 
					  }
                }}
            />
            <TextField 
                name='option1'
                label='Option 1'
                value={formState.option1}
                onChange={handleFormChange}
                variant='standard'
                focused={false}
                sx={{
                    ...styles,
                    '& .MuiInputBase-input': {
						color: theme.palette.text.primary, 
					  }
                }}
            />
            <TextField 
                name={'option2'}
                label='Option 2'
                value={formState.option2}
                onChange={handleFormChange}
                variant='standard'
                focused={false}
                sx={{
                    ...styles,
                    '& .MuiInputBase-input': {
						color: theme.palette.text.primary,
					  }
                }}
            />
            <Button 
                variant='contained' 
                disabled={!formState.question || !formState.option1 || !formState.option2} 
                sx={{ width: '80%', bgcolor: theme.palette.utility.main, '&:hover': { bgcolor: theme.palette.utility.secondary}}} 
                onClick={handleSubmit}
            >
                <Typography variant='h6' sx={{ color: theme.palette.text.primary, fontWeight: 700}}>Send Poll</Typography>
            </Button>
        </Box>
        </>
    )
};