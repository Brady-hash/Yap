import { Box, Drawer, Typography, Button } from "@mui/material";
import { Close } from "@mui/icons-material/";
import { LeaveThreadButton } from "./leaveThreadBtn";

export const ThreadDetails = ({ thread, detailsToggled, onClose }) => {

    return (
        <>
        <Drawer
            variant="temporary" 
            anchor="right" 
            open={true}
            onClose={onClose} 
            sx={{
                width: 240, 
                flexShrink: 0, 
                '& .MuiDrawer-paper': {
                    width: '80%', 
                    boxSizing: 'border-box', 
                    border: 'solid white 2px', 
                    bgcolor: 'black'
                },
            }}
        >
            <Box sx={{ border: 'solid white 2px'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Button 
                        variant='outlined' 
                        sx={{maxWidth: '65px', height: '65px', m: 2}}
                        onClick={onClose}
                    >
                        <Close />
                    </Button>
                    <Typography variant='h5' sx={{color: 'white' }}>{thread.name}</Typography>
                    <LeaveThreadButton sx={{height: '65px', width: '65px', m: 2}}/>
                </Box>
                {thread.participants.map((participant) => (
                    <Box 
                        key={participant._id} 
                        sx={{ border: 'solid white 2px', height: '75px', display: 'flex', alignItems: 'center' }}
                    >
                        <Typography 
                            variant='h5' 
                            sx={{ color: 'white'}}
                        >
                            {participant.username}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Drawer>
        </>
    )
};