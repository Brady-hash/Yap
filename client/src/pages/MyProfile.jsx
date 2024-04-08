import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_USER } from '../utils/mutations';

import  AuthService from '../utils/auth'
import { useAuthContext } from '../context/AuthContext';
import {io} from 'socket.io-client';

const socket = io('http://localhost:3000');

function Profile() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  if (!authUser) {
    AuthService.redirectToLogin();
    return null;
  }
  
  const [userData, setUserData] = useState({ username: '', email: '', friendCount: '' });
  const [isEditing, setEditing] = useState(false);

  // GraphQL query to get the user's profile
  const { loading, error, data } = useQuery(QUERY_ME);
  
  // Mutation to update user profile
  const [updateUserProfile] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (data) {
      setUserData({ 
        username: data.me.username || '', 
        email: data.me.email || '', 
        friendCount: data.me.friendCount || 0 });
    }
  }, [data]);

  useEffect(() => {
    const handleUserUpdated = (updatedUserData) => {
      console.log('user-updated', updatedUserData);
      setUserData(updatedUserData);
    };
    socket.on('user-updated', handleUserUpdated);
    return () =>{
      socket.off('user-updated', handleUserUpdated);
       socket.disconnect();
    }
  }, [socket]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile!</p>;

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
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-info">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input type="text" name="username" value={userData.username} onChange={handleInputChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
            </label>
            <button type="submit">Save Changes</button>
            <button onClick={handleEditToggle}>Cancel</button>
          </form>
        ) : (
          <>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <p>Friends: {userData.friendCount}</p>
            <button onClick={handleEditToggle}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
