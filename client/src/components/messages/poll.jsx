import { Box, Typography, Button } from '@mui/material';
import { DeletePollBtn } from '../btns/DeletePollBtn';
import { useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { ANSWER_QUESTION, DELETE_QUESTION } from '../../utils/mutations';

export const Poll = ({ poll, refetch, isAdmin }) => {

    const [pollData, setPollData] = useState(poll)

    const [answerQuestion, { error: answerQuestionError }] = useMutation(ANSWER_QUESTION, {
        onCompleted: (data) => {
            setPollData(data.answerQuestion)
        }
    });

    const [deleteQuestion, { error: deleteQuestionError }] = useMutation(DELETE_QUESTION);

    const handleAnswerQuestion = async (event) => {
        const answerOption = event.currentTarget.name;
        let variables = { questionId: poll._id, answer: answerOption}

        const data = await answerQuestion({
            variables: variables
        });
    };

    const handleDeletePoll = () => {
        console.log(poll._id)
        deleteQuestion({
            variables: { questionId: poll._id },
            onCompleted: () => {
                refetch()
            }
        })
    }

    const totalVotes = pollData.answerCount;
    const option1Percentage = totalVotes > 0 ? (pollData.option1Count / totalVotes) * 100 : 0;

    return (
        <>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', mb: 5, mt: 5 }}>
        <Box sx={{ border: 'solid #444 2px', borderRadius: 3, boxShadow: 10, bgcolor: 'black', display: 'flex', flex:'1', minWidth: '70vw', maxWidth: '90vw', flexDirection: 'column', justifyContent: 'center', alignItems:'center', p: 5, mx: 1, position: 'relative'}}>

            <Box sx={{ mb: 2, borderRadius: 2, bgcolor: 'white', width:'90%', display: 'flex', justifyContent: 'center'}}>
                <Typography variant='h5' sx={{color: '#444', p: 2, textAlign: 'center' }}>{poll.text}</Typography>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent:'center', gap: 2 }}>
                    <Button name='option1' variant='contained' sx={{ minWidth: '30vw', maxWidth: '60vw', bgcolor: 'red', '&:hover': { bgcolor: 'darkred' }}} onClick={handleAnswerQuestion}><Typography variant='span' sx={{fontSize: '15px'}}>{poll.option1}</Typography></Button>
                    <Button name='option2' variant='contained' sx={{ minWidth: '30vw', maxWidth: '60vw', bgcolor: 'blue', '&:hover': { bgcolor: 'darkblue' }}} onClick={handleAnswerQuestion}><Typography variant='span' sx={{fontSize: '15px'}}>{poll.option2}</Typography></Button>
                </Box>
                <Box sx={{ 
                    border: 'solid #444 2px', 
                    borderRadius: 2, width: '100%', 
                    height: '30px', 
                    mt: 2,
                    background: totalVotes > 0 ? 'blue' : '#444'

                    }}
                >
                    <Box sx={{ ...(option1Percentage === 100 && { borderRadius: 1.5 }), borderTopLeftRadius: 6, borderBottomLeftRadius: 6, bgcolor: 'red', width: `${option1Percentage}%`, height: '100%' }}></Box>
                </Box>
            </Box>
            {isAdmin && <DeletePollBtn handleDeletePoll={handleDeletePoll}/>}
            </Box>
        </Box>
        </>
    )
};