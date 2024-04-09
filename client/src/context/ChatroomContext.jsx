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
        }
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

    const updateCombinedData = (newData) => {
        setCombinedData((prevData) => {
            const updatedData = [...prevData, newData];
            return updatedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
    };

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

    // const isAdmin = threadData.data.admins.some(admin => admin._id.toString() === userData._id);



    return(
        <ChatroomContext.Provider value={{ userId, combinedData, addToCombinedData, removeFromCombinedData, thread, currentUserIsAdmin }}>
            { children }
        </ChatroomContext.Provider>
    )
};

