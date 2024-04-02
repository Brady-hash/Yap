import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      id
      name
      profilePicture
      // add other fields as needed
    }
  }
`;

function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { userId },
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <img src={data.user.profilePicture} alt="Profile" />
      <h2>{data.user.name}</h2>
      {/* display other user data as needed */}
    </div>
  );
}

export default UserProfile;