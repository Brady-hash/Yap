import { Box, Typography, Button } from '@mui/material';
import { useMutation } from '@apollo/client';
import { ANSWER_QUESTION } from '../../utils/mutations';

export const Poll = ({ poll }) => {

    console.log(poll)

    const [answerQuestion, { error }] = useMutation(ANSWER_QUESTION);

    const handleAnswerQuestion = async (event) => {
        const answerOption = event.currentTarget.name;
        let variables = { questionId: poll._id, answer: answerOption}

        const data = await answerQuestion({
            variables: variables
        });

        console.log(data)
    }

    return (
        <>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', mb: 5, mt: 5 }}>
        <Box sx={{ border: 'solid #444 2px', borderRadius: 3, boxShadow: 10, bgcolor: 'black', display: 'flex', flex:'1', minWidth: '70vw', maxWidth: '90vw', flexDirection: 'column', justifyContent: 'center', alignItems:'center', p: 5, mx: 1}}>

            <Box sx={{ mb: 2, borderRadius: 2, bgcolor: 'white', width:'90%', display: 'flex', justifyContent: 'center'}}>
                <Typography variant='h5' sx={{color: '#444', p: 2, textAlign: 'center' }}>{poll.text}</Typography>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent:'center', gap: 2 }}>
                    <Button name='option1' variant='contained' sx={{ minWidth: '30vw', maxWidth: '60vw'}} onClick={handleAnswerQuestion}><Typography variant='span' sx={{fontSize: '15px'}}>{poll.option1}</Typography></Button>
                    <Button name='option2' variant='contained' sx={{ minWidth: '30vw', maxWidth: '60vw' }} onClick={handleAnswerQuestion}><Typography variant='span' sx={{fontSize: '15px'}}>{poll.option2}</Typography></Button>
                </Box>
                <Box sx={{ 
                    border: 'solid white 2px', 
                    borderRadius: 2, width: '100%', 
                    height: '30px', 
                    mt: 2,
                    background: `linear-gradient(to right, red ${poll.option1Percentage}%, blue ${poll.option1Percentage}%)` 

                    }}
                >

                    </Box>
            </Box>
            </Box>
        </Box>
        </>
    )
};