import { useState } from "react";
import { Box, Drawer, Typography, Button, Avatar, Badge } from "@mui/material";
import { Close, Star, AdminPanelSettings, RemoveModerator } from "@mui/icons-material/";

import { EditThread } from "./editThread";

import { LeaveThreadBtn } from "../btns/LeaveThreadBtn";
import { RemoveAdminBtn } from "../btns/RemoveAdminBtn";
import { AddToThreadBtn } from "../btns/AddToThreadBtn";
import { AddAdminBtn } from "../btns/AddAdminBtn";
import { KickUserBtn } from "../btns/KickUserBtn";
import { useChatroomContext } from "../../context/ChatroomContext";

import  { UserProfile } from '../UserProfile';

export const ThreadDetails = ({ detailsToggled, onClose }) => {

    const { thread, currentUserIsAdmin, userId } = useChatroomContext();
    const [showUserProfileTD, setShowUserProfileTD] = useState(null);
    
    const isAdmin = (participantId) => {
        return thread.admins.some(admin => admin._id.toString() === participantId.toString());
    };

    const isCreator = (participantId) => {

        return thread.creator === participantId;
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
                    bgcolor: '#444'
                },
            }}
        >
            <Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', bgcolor: '#555', width: '80%', zIndex: 10, boxShadow: 5, p: 2}}>
                    <Button 
                        variant='contained' 
                        sx={{ bgcolor: '#222831', '&:hover': { bgcolor: '#455d7a'}}}
                        onClick={onClose}
                    >
                        <Close sx={{ fontSize: 30 }}/>
                    </Button>
                    <Typography variant='h5' sx={{color: 'white' }}>{thread.name}</Typography>
                    <LeaveThreadBtn sx={{height: '65px', width: '65px', m: 2}} thread={thread}  />
                </Box>
                <Box sx={{pt: 13}}>
                {thread.participants.map((participant) => (
                    <Box 
                        key={participant._id} 
                        sx={{ borderBottom: 'solid #666 2px', height: '75px', display: 'flex', alignItems: 'center'}}
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
                        {isAdmin(participant._id) && !isCreator(participant._id) && !isCreator(userId) && <Typography variant='span' sx={{ position: 'absolute', right: 35, color: '#888'}}>(admin)</Typography>}
                        {/* if the current participant is the creator, we give them a creator tag */}
                        {isCreator(participant._id) && <Typography variant='span' sx={{ position: 'absolute', right: 35, color: '#888'}}>(creator)</Typography>}
                        {/* if the current logged in user is the creator we give them the option of adding current admins*/}
                        {isCreator(userId) && userId !== participant._id && !isAdmin(participant._id) && <AddAdminBtn threadId={thread._id} userId={participant._id}/>}
                        {/* if the current logged in user is the creator we give them the option of removing admins */}
                        {isCreator(userId) && userId !== participant._id && isAdmin(participant._id) && (<RemoveAdminBtn threadId={thread._id} userId={participant._id}/>)}
                        {isCreator(userId) && userId !== participant._id && <KickUserBtn userIdToKick={participant._id} threadId={thread._id}/>}
                    </Box>
                ))}
                </Box>
                {isCreator(userId) && <EditThread name={thread.name} threadId={thread._id}/> }
                {/* {isCreator(userId) && <AddToThreadBtn />} */}
            </Box>
        </Drawer>
        </>
    )
};