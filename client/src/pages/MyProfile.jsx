import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Button, TextField } from '@mui/material';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_USER } from '../utils/mutations';

import { BackBtn } from '../components/btns/BackBtn';

function Profile() {
    const [userData, setUserData] = useState({ username: '', email: '', friendCount: '' });
    const [isEditing, setEditing] = useState(false);
    const { loading, error, data } = useQuery(QUERY_ME);
    const [updateUserProfile] = useMutation(UPDATE_USER);

    useEffect(() => {
        if (data) {
            setUserData({
                username: data.me.username || '', 
                email: data.me.email || '', 
                friendCount: data.me.friendCount || 0
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
            console.log('Successfully updated user info');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
            < BackBtn />
            <Typography variant="h4" sx={{ mb: 2 }}>My Profile</Typography>
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
                    <>
                        <Typography>Username: {userData.username}</Typography>
                        <Typography>Email: {userData.email}</Typography>
                        <Typography>Friends: {userData.friendCount}</Typography>
                        <Button onClick={handleEditToggle} sx={{ mt: 1 }}>Edit Profile</Button>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Profile;
