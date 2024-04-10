import { Box, Typography } from '@mui/material';
import { OpenThreadBtn } from '../btns/OpenThreadBtn';
import { JoinThreadBtn } from '../btns/JoinThreadBtn';
import { useUserContext } from '../../context/UserContext';

export const ThreadHit = ({ hit }) => {
    const { threads, userId, } = useUserContext();
    const belongsToThread = threads.some(thread => thread._id === hit.objectID);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'solid #666 2px', p: 1}}>
                <Typography variant='h6' sx={{ color: 'white' }}>{hit.name}</Typography>
                {belongsToThread ? 
                    <OpenThreadBtn threadId={hit.objectID}/>
                    :
                    <JoinThreadBtn threadId={hit.objectID}/>
                }
            </Box>
        </Box>
    );
}