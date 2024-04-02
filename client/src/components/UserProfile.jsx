import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { QUERY_ONE_USER_PROFILE } from '../utils/queries';

function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(QUERY_ONE_USER_PROFILE, {
    variables: { userId },
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const user = data?.user;

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
           <button onClick={onClose}> 
           Exit
           </button>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Friend Count: {user.friendCount}</p>
          <p>Answer: {user.answerChoices.answerChoice}</p>   
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
}

export default UserProfile;