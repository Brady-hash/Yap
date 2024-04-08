import { Box, Typography, Avatar, Button } from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import { UserProfile } from '../UserProfile';
import { AddFriendBtn } from '../btns/AddFriendBtn';
import { RemoveFriendBtn } from '../btns/RemoveFriendBtn';
import { PeopleOutline } from '@mui/icons-material';
import { useUserContext } from '../../context/UserContext';

export const UserHit = ({ hit,  }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const { friends, userId } = useUserContext();

    const hitIsFriend = friends.some(friend => friend._id === hit.objectID);

    const [isFriend, setIsFriend] = useState(hitIsFriend);
    const isCurrentUser = userId === hit.objectID;

    const handleClick = (event) => {
        if (showProfile && profileId === hit.objectID) {
            setShowProfile(false)
        } else {
            setProfileId(hit.objectID);
            setShowProfile(true);
        }
    }

    return (
        <>
        <Box sx={{ borderBottom: 'solid white 2px', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1}}>
                    <Avatar id={hit.objectID} onClick={handleClick} sx={{ marginRight: 2 }} />
                    <Typography variant='h6'>{hit.username ? hit.username : hit.name}</Typography>
                    {!isCurrentUser && (
                        !isFriend ? 
                        <AddFriendBtn friendId={hit.objectID} setIsFriend={setIsFriend}/> : 
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <PeopleOutline sx={{fontSize: 30, color: 'gray', mx: 1}}/>
                            <RemoveFriendBtn friendId={hit.objectID} setIsFriend={setIsFriend}/>
                        </Box>
                    )}
                </Box>
            </Box>
      {showProfile && profileId && <UserProfile userId={profileId} onClose={() => setShowProfile(false)}/>}
      </>
    );
}