import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import UserProfile from './UserProfile';
import { QUERY_ONE_THREAD} from '../utils/queries';

function Chatroom({ isGroupChat, participants,}) {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showParticipantsList, setShowParticipantsList] = useState(false);

  const handleUserClick = userId => {
      setSelectedUserId(userId);
      setShowUserProfile(true);
  }

  const toggleParticipantsList = () => {
      setShowParticipantsList(prevState => !prevState);
  };

  const closeUserProfile = () => {
      setShowUserProfile(false);
  };


  return (
      <div>
          
          {isGroupChat && (
              <>
                  <button onClick={toggleParticipantsList}>
                      {showParticipantsList ? 'Hide Participants' : 'Show Participants'}
                  </button>
                  {showParticipantsList && (
                      <div className="participants-list">
                          {participants.map(participant => (
                              <div key={participant.id} onClick={() => handleUserClick(participant.id)}>
                                  <img src={participant.image} alt={participant.name} />
                                  <span>{participant.name}</span>
                              </div>
                          ))}
                      </div>
                  )}
              </>
          )}

          {!isGroupChat && participants.length > 0 && (
              <div onClick={() => handleUserClick(participants[0].id)}>
                  <img src={participants[0].image} alt={participants[0].name} />
                  <span>{participants[0].name}</span>
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
