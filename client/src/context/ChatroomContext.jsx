import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_ONE_THREAD, QUERY_ME } from '../utils/queries';

const ChatroomContext = createContext();

export const useChatroomContext = () => useContext(ChatroomContext);

export const ChatroomProvider = ({ children }) => {

    const { threadId } = useParams();
    const [combinedData, setCombinedData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);

    const {data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);
    const {data: threadData, loading: threadLoading, error: threadError} = useQuery(QUERY_ONE_THREAD, {
        variables: {
            threadId
        },
        pollInterval: 5000,
    });
    const [thread, setThread] = useState({});

    useEffect(() => {
        if (threadData && threadData.thread) {
            const updatedCombinedData = [...threadData.thread.messages, ...threadData.thread.questions]
                .sort((a, b) => parseInt(a.createdAt, 10) - parseInt(b.createdAt, 10));
            setCombinedData(updatedCombinedData);
            setThread(threadData.thread)
            if (userData && userData.me) {
                setUserId(userData.me._id)
                setCurrentUserIsAdmin(threadData.thread.admins.some(admin => admin._id.toString() === userData.me._id.toString()))
            }
        }
    }, [threadData, userData]);

    const addToCombinedData = (newData) => {
        setCombinedData((prevData) => {
            const updatedData = [...prevData, newData];
            return updatedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
    };

    const removeFromCombinedData = (idToRemove) => {
        setCombinedData((prevData) => {
            const updatedData = prevData.filter(item => item._id !== idToRemove);
            return updatedData;
        });
    };

    const removeParticipant = (userIdToRemove) => {
        if (thread && thread.participants) {
            const updatedParticipants = thread.participants.filter(participant => participant._id !== userIdToRemove);
            // Update the thread state with the new list of participants
            setThread(prevThread => ({ ...prevThread, participants: updatedParticipants }));
        }
    };

    const addParticipant = (newParticipantId) => {
        const newParticipant = friends.find(friend => friend._id === newParticipantId);
        if (!newParticipant) return; // Exit if the friend is not found
    
        const updatedParticipants = [...thread.participants, newParticipant];
    
        setThread(prevThread => ({
            ...prevThread,
            participants: updatedParticipants
        }));
    };

    const updatePollDataInCombinedData = (updatedPoll) => {
        setCombinedData(currentData => {
            return currentData.map(item => {
                if (item._id === updatedPoll._id) {
                    return updatedPoll; // Update the poll with new data
                }
                return item; // Keep other items as they are
            }).sort((a, b) => parseInt(a.createdAt, 10) - parseInt(b.createdAt, 10)); // Resort if necessary
        });
    };

    return(
        <ChatroomContext.Provider value={{ userId, combinedData, addToCombinedData, removeFromCombinedData, thread, currentUserIsAdmin, updatePollDataInCombinedData, removeParticipant, addParticipant }}>
            { children }
        </ChatroomContext.Provider>
    )
};

