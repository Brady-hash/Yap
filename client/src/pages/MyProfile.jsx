import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_USER_PROFILE, UPDATE_USER_PROFILE } from './graphql/queries';

function Profile() {
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [isEditing, setEditing] = useState(false);

  // GraphQL query to get the user's profile
  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  
  // Mutation to update user profile
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

  useEffect(() => {
    if (data) {
      setUserData({ username: data.user.username, email: data.user.email });
    }
  }, [data]);

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
            <button onClick={handleEditToggle}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
