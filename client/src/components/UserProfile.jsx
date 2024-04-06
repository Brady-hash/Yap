import React from 'react';
import { useQuery } from '@apollo/client';
import { Box, Typography, Button } from '@mui/material';
import { Close } from "@mui/icons-material/";
import { QUERY_ONE_USER_PROFILE } from '../utils/queries';

export const UserProfile = ({ userId, onClose }) => {
  const { loading, error, data } = useQuery(QUERY_ONE_USER_PROFILE, {
    variables: { userId }
});

if (loading) return <Box sx={{ p: 2}} > Loading... </Box>;
if (error) return <Box sx={{ p: 2 }} > Error! {error.message} </Box>;

const { user } = data;

return (
  <Box sx={{ position: 'fixed', width: 300, height: 'auto', background: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: 2, borderRadius: '5px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100 }}>
      <Button 
      variant="contained" 
      color="primary" 
      onClick={onClose}>
        <Close />
      </Button>

      <Typography variant="h6">{user.username}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">Friends: {user.friendCount}</Typography>
      <Typography variant="body1">Todays Answer: :</Typography>
      {/* <ul>
          {user.answerChoices.map((choice, index) => (
              <li key={index}>{choice.answerChoice}</li>
          ))}
      </ul> */}
  </Box>
);
};
