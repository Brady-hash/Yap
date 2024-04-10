import { Box, Typography, Button } from '@mui/material';
import { useUserContext } from '../context/UserContext';
import { useMutation } from '@apollo/client';
import { ANSWER_QUESTION } from '../utils/mutations';

const MainPoll = () => {
    const { mainPoll, userId, refreshUserData, hasAnswered, selectedOption } = useUserContext();

    const [answerMainPoll] = useMutation(ANSWER_QUESTION, {
        onCompleted: () => {
            refreshUserData();
        },
        onError: (error) => {
            console.error('Error answering main poll:', error);
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
            console.error('Error answering main poll:', error);
        }
    };

    if (!mainPoll) return <Typography>Loading main poll...</Typography>;

    const totalVotes = mainPoll.option1Count + mainPoll.option2Count;
    let option1Percentage, option2Percentage;

    if (totalVotes === 0) {
        option1Percentage = 50;
        option2Percentage = 50;
    } else {
        option1Percentage = (mainPoll.option1Count / totalVotes) * 100;
        option2Percentage = 100 - option1Percentage;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 5, mt: 1 }}>
            <Typography variant='h3' sx={{ color: 'white', p: 2, textAlign: 'center' }}>The Daily Yap</Typography>
            <Box sx={{ borderRadius: 3, boxShadow: 10, bgcolor: 'rgba(0, 0, 0, 0.5)', display: 'flex', flex: '1', minWidth: '70vw', maxWidth: '90vw', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, mx: 1, position: 'relative' }}>
                <Typography variant='h5' sx={{ color: 'white', p: 0, textAlign: 'center' }}>{mainPoll.text}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button
                        variant='contained'
                        sx={{ bgcolor: 'red', ':hover': { bgcolor: 'darkred' }}}
                        onClick={() => handleAnswerQuestion('option1')}
                        disabled={hasAnswered && selectedOption !== 'option1'}
                    >
                        {mainPoll.option1}
                    </Button>
                    <Button
                        variant='contained'
                        sx={{ bgcolor: 'blue', ':hover': { bgcolor: 'darkblue' }}}
                        onClick={() => handleAnswerQuestion('option2')}
                        disabled={hasAnswered && selectedOption !== 'option2'}
                    >
                        {mainPoll.option2}
                    </Button>
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography textAlign="center" color="white">Votes: {totalVotes}</Typography>
                    <Box sx={{ display: 'flex', height: '30px', borderRadius: 2, bgcolor: '#444', width: '100%' }}>
                        <Box sx={{ bgcolor: 'red', width: `${option1Percentage}%` }} />
                        <Box sx={{ bgcolor: 'blue', width: `${option2Percentage}%` }} />
                    </Box>
                    <Typography textAlign="center" color="white" sx={{ mt: 1 }}>
                        <span style={{ color: 'red', textShadow: '1px 1px 0 black' }}> {option1Percentage.toFixed(1)}% </span> vs <span style={{ color: 'blue', textShadow: '1px 1px 0 black' }}> {option2Percentage.toFixed(1)}%</span>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default MainPoll;
