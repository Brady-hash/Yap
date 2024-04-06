import { Box, Typography, Button } from '@mui/material';

export const Poll = ({ poll }) => {
    return (
        <>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', mb: 10}}>
            <Box sx={{ mb: 2, borderRadius: 2, bgcolor: 'white', width:'75%', display: 'flex', justifyContent: 'center'}}>
                <Typography variant='h4' sx={{color: '#444', p: 2, textAlign: 'center' }}>{poll.text}</Typography>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent:'center', gap: 6 }}>
                    <Button variant='contained' sx={{ width: '45%'}}><Typography variant='h6'>{poll.option1}</Typography></Button>
                    <Button variant='contained' sx={{ width: '45%'}}><Typography variant='h6'>{poll.option2}</Typography></Button>
                </Box>
                <Box sx={{ border: 'solid white 2px', borderRadius: 2, bgcolor: 'red', width: '100%', height: '30px', mt: 2}}></Box>
            </Box>
        </Box>
        </>
    )
};