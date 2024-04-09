import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useUserContext } from '../context/UserContext';
import { useMutation } from '@apollo/client';
import { ANSWER_QUESTION } from '../utils/mutations';

const MainPoll = () => {
    const { mainPoll, refreshUserData } = useUserContext();
    const [hasAnswered, setHasAnswered] = useState(false);
    const [answerMainPoll] = useMutation(ANSWER_QUESTION, {
        onCompleted: () => {
            refreshUserData();
            setHasAnswered(true); 
        },
        onError: (error) => {
            if (error.message.includes('already submitted')) {
                setHasAnswered(true);
            }
        }
    });

    const handleAnswerQuestion = async (answerOption) => {
        if (hasAnswered) {
            console.log('You have already answered this poll.');
            return;
        }

        try {
            await answerMainPoll({
                variables: { questionId: mainPoll._id, answer: answerOption }
            });
        } catch (error) {
            if (!error.message.includes('already submitted')) {
                console.error('Error answering main poll:', error);
            }
        }
    };

    if (!mainPoll) return <Typography>Loading main poll...</Typography>;

    const totalVotes = mainPoll.option1Count + mainPoll.option2Count;
    const option1Percentage = totalVotes > 0 ? (mainPoll.option1Count / totalVotes) * 100 : 0;
    const option2Percentage = 100 - option1Percentage;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 5, mt: 5 }}>
            <Box sx={{ border: 'solid #444 2px', borderRadius: 3, boxShadow: 10, bgcolor: 'black', display: 'flex', flex: '1', minWidth: '70vw', maxWidth: '90vw', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 5, mx: 1, position: 'relative' }}>
                <Typography variant='h5' sx={{ color: 'white', p: 2, textAlign: 'center' }}>{mainPoll.text}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button variant='contained' sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' }}} onClick={() => handleAnswerQuestion('option1')}>
                        {mainPoll.option1}
                    </Button>
                    <Button variant='contained' sx={{ bgcolor: 'blue', '&:hover': { bgcolor: 'darkblue' }}} onClick={() => handleAnswerQuestion('option2')}>
                        {mainPoll.option2}
                    </Button>
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography textAlign="center" color="white">Votes: {totalVotes}</Typography>
                    <Box sx={{ display: 'flex', height: '30px', borderRadius: 2, bgcolor: '#444' }}>
                        <Box sx={{ bgcolor: 'red', width: `${option1Percentage}%` }} />
                        <Box sx={{ bgcolor: 'blue', width: `${option2Percentage}%` }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MainPoll;
