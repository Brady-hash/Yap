import { useState } from "react";
import { Box, Drawer, Typography, Button, Avatar, Badge } from "@mui/material";
import { Close, Star, AdminPanelSettings, RemoveModerator } from "@mui/icons-material/";
import { LeaveThreadButton } from "./leaveThreadBtn";
import { RemoveAdmin } from "./removeAdmin";
import { AddAdmin } from "./addAdmin";
import  { UserProfile } from '../UserProfile';


export const ThreadDetails = ({ thread, detailsToggled, onClose, currentUser }) => {

    const [showUserProfileTD, setShowUserProfileTD] = useState(null);

    const [admins, setAdmins] = useState(thread.admins);
    
    const isAdmin = (participantId) => {
        return thread.admins.some(admin => admin._id.toString() === participantId.toString());
    };

    const isCreator = (participantId) => {
        return thread.creator === participantId
    };

    return (
        <>
        <Drawer
            variant="temporary" 
            anchor="right" 
            open={detailsToggled}
            onClose={onClose} 
            sx={{
                width: 240, 
                flexShrink: 0, 
                '& .MuiDrawer-paper': {
                    width: '80%', 
                    boxSizing: 'border-box', 
                    border: 'solid white 2px', 
                    bgcolor: '#444'
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
                        sx={{ border: 'solid white 2px', height: '75px', display: 'flex', alignItems: 'center'}}
                    >
                        <Avatar
                            src=''
                            onClick={() => setShowUserProfileTD(participant._id)}
                            sx={{
                                ml: 1 ,
                                cursor: 'pointer'
                            }}
                        />
                        {showUserProfileTD === participant._id && (
                        <UserProfile 
                        userId={participant._id}
                        onClose={() => setShowUserProfileTD(null)}
                        />
                        )}
                        <Typography 
                            variant='h5' 
                            sx={{ color: 'white', ml: 3 }}
                        >
                            {participant.username} 
                        </Typography>
                        {/* if the current participant is an admin, but not the creator, we give them an admin tag*/}
                        {isAdmin(participant._id) && !isCreator(participant._id) && <Typography variant='span' sx={{ position: 'absolute', right: 35, color: '#888'}}>(admin)</Typography>}
                        {/* if the current participant is the creator, we give them a creator tag */}
                        {isCreator(participant._id) && <Typography variant='span' sx={{ position: 'absolute', right: 35, color: '#888'}}>(creator)</Typography>}
                        {/* if the current logged in user is the creator we give them the option of adding current admins*/}
                        {isCreator(currentUser._id) && currentUser._id !== participant._id && !isAdmin(participant._id) && <AddAdmin threadId={thread._id} userId={participant._id}/>}
                        {/* if the current logged in user is the creator we give them the option of removing admins */}
                        {isCreator(currentUser._id) && currentUser._id !== participant._id && isAdmin(participant._id) && <RemoveAdmin threadId={thread._id} userId={participant._id}/>}
                    </Box>
                ))}
            </Box>
        </Drawer>
        </>
    )
};