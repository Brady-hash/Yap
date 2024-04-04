import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import UserProfile from '../components/UserProfile';
import { QUERY_ONE_THREAD } from '../utils/queries';
import io from 'socket.io-client';

function Chatroom() {
  const { threadId } = useParams();
  const { loading, data, error } = useQuery(QUERY_ONE_THREAD, {
    variables: { threadId }
  });

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [socket, setSocket] = useState(null);

    useEffect(() => {
    // create a new socket connection
    const newSocket = io();
    setSocket(newSocket);
    return () => {
        newSocket.close();
    };
    }, []);
// handle the user click event
  const handleUserClick = userId => {
    setSelectedUserId(userId);
    setShowUserProfile(true);
  };
// toggle the participants list
  const toggleParticipantsList = () => {
    setShowParticipantsList(prevState => !prevState);
  };
// close the user profile
  const closeUserProfile = () => {
    setShowUserProfile(false);
  };
  
//   useEffect(() => {
//     if(!socket) return;
//     socket.on('thread-updated', thread => {
//         console.log('thread updated');
//         });


  if (loading) return <p>Loading chatroom...</p>;
  if (error) return <p>Error loading chatroom: {error.message}</p>;

  const thread = data ? data.thread : null;
  const participants = thread ? thread.participants : [];

  return (
    <div>
      {thread && thread.isGroupChat && (
        <>
          <button onClick={toggleParticipantsList}>
            {showParticipantsList ? 'Hide Participants' : 'Show Participants'}
          </button>
          {showParticipantsList && (
            <div className="participants-list">
              {participants.map(participant => (
                <div key={participant._id} onClick={() => handleUserClick(participant._id)}>
                  <img src={participant.image} alt={participant.username} />
                  <span>{participant.username}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!thread.isGroupChat && participants.length > 0 && (
        <div onClick={() => handleUserClick(participants[0]._id)}>
          <img src={participants[0].image} alt={participants[0].username} />
          <span>{participants[0].username}</span>
        </div>
      )}

      {showUserProfile && (
        <UserProfile userId={selectedUserId} onClose={closeUserProfile} />
      )}
    </div>
  );
}

export default Chatroom;


//for MessageHUb
// import { QUERY_ALL_THREADS } from '../utils/queries';
// const { loading, error, data } = useQuery(QUERY_ALL_THREADS);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;
