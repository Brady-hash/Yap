import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [userId, setUserId] = useState(null);
    const [threads, setThreads] = useState([]);
    const { data, loading, error } = useQuery(QUERY_ME);

    useEffect(() => {
        if (!loading && data && data.me) {
            setFriends(data.me.friends || []);
            setUserId(data.me._id);
            setThreads(data.me.messageThreads || []);
        }
    }, [data, loading]);
    const addFriend = (friendId) => {
        if (!friends.some(friend => friend._id === friendId)) {
            setFriends(currentFriends => [...currentFriends, friendId]);
        }
    };

    const removeFriend = (friendId) => {
        setFriends(currentFriends => currentFriends.filter(id => id !== friendId));
    };

    const addThread = (thread) => {
        setThreads(currentThreads => [...currentThreads, { _id: thread._id, name: thread.name }])
    };

    const removeThread = (threadId) => {
        setThreads(currentThreads => currentThreads.filter(thread => thread._id !== threadId));
    }

    return (
        <UserContext.Provider value={{ userId, threads, friends, addFriend, removeFriend, addThread, removeThread }}>
            {children}
        </UserContext.Provider>
    );
};