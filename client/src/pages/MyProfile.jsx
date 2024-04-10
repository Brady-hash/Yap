import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Button, TextField } from '@mui/material';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_USER } from '../utils/mutations';
import { useUserContext } from '../context/UserContext';

import { BackBtn } from '../components/btns/BackBtn';

function Profile() {
    const [userData, setUserData] = useState({ username: '', email: '', friendCount: '' });
    const [isEditing, setEditing] = useState(false);
    const { loading, error, data } = useQuery(QUERY_ME);
    const [updateUserProfile] = useMutation(UPDATE_USER);
    const { friendCount } = useUserContext();

    useEffect(() => {
        if (data) {
            setUserData({
                username: data.me.username || '', 
                email: data.me.email || '', 
                friendCount: friendCount || 0
            });
        }
    }, [data]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading profile!</Typography>;

    const handleEditToggle = () => {
        setEditing(!isEditing);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await updateUserProfile({ variables: { username: userData.username, email: userData.email } });
            setEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
        component="main" 
        maxWidth="xs"
        sx={{ 
            height: "100vh",
            margin: 'auto',
            padding: 2 
            }}>
            < BackBtn
            />
            <Typography variant="h4" sx={{ fontSize: 35, color:"white"}} >My Profile</Typography>
            <Box className="profile-info">
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <TextField 
                            label="Username"
                            type="text" 
                            name="username" 
                            value={userData.username} 
                            onChange={handleInputChange} 
                            fullWidth 
                            margin="normal"
                        />
                        <TextField 
                            label="Email"
                            type="email" 
                            name="email" 
                            value={userData.email} 
                            onChange={handleInputChange} 
                            fullWidth 
                            margin="normal"
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
                            <Button onClick={handleEditToggle} sx={{ ml: 1 }}>Cancel</Button>
                        </Box>
                    </form>
                ) : (
                    <Box sx={{ 
                        color: "white", 
                        width: '100%', 
                        maxWidth: 360, 
                        margin: 'auto', 
                        marginTop: '5vh', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-start'
                    }}>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography sx={{ mb: 2, textAlign: 'left' }}>Username: {userData.username}</Typography>
                            <Typography sx={{ mb: 2, textAlign: 'left' }}>Email: {userData.email}</Typography>
                            <Typography sx={{ mb: 2, textAlign: 'left' }}>Friends: {userData.friendCount}</Typography>
                            <Button onClick={handleEditToggle} variant="contained" sx={{ mt: 1 }}>Edit Profile</Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Profile;
