import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { QUERY_ONE_THREAD, QUERY_ME } from '../utils/queries';

const ChatroomContext = createContext();

export const useChatroomContext = () => useContext(ChatroomContext);

export const ChatroomProvider = ({ children }) => {

    const { threadId } = useParams();
    const navigate = useNavigate();
    const [combinedData, setCombinedData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);

    const {data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);
    const {data: threadData, loading: threadLoading, error: threadError} = useQuery(QUERY_ONE_THREAD, {
        variables: {
            threadId
        },
        pollInterval: 10000,
    });
    const thread = threadData?.thread || null

    useEffect(() => {
        if (threadData && threadData.thread) {
            const updatedCombinedData = [...threadData.thread.messages, ...threadData.thread.questions]
                .sort((a, b) => parseInt(a.createdAt, 10) - parseInt(b.createdAt, 10));
            setCombinedData(updatedCombinedData);
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
        <ChatroomContext.Provider value={{ userId, combinedData, addToCombinedData, removeFromCombinedData, thread, currentUserIsAdmin, updatePollDataInCombinedData }}>
            { children }
        </ChatroomContext.Provider>
    )
};

