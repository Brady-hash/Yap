import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [friendCount, setFriendCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [threads, setThreads] = useState([]);
    const { data, loading, error, refetch } = useQuery(QUERY_ME);

    useEffect(() => {
        if (!loading && data && data.me) {
            setFriends(data.me.friends || []);
            setUserId(data.me._id);
            setThreads(data.me.messageThreads || []);
            setFriendCount(data.me.friendCount || 0);
        }
    }, [data, loading]);

    const refreshUserData = async () => {
        try {
            const { data } = await refetch();
            if (data && data.me) {
                setFriends(data.me.friends || []);
                setUserId(data.me._id);
                setThreads(data.me.messageThreads || []);
                setFriendCount(data.me.friendCount || 0);
            }
        } catch (error) {
            console.error("Failed to refetch data:", error);
        }
    };

    const addFriend = (friendId) => {
        if (!friends.some(friend => friend._id === friendId)) {
            setFriends(currentFriends => [...currentFriends, friendId]);
            setFriendCount(friendCount + 1)
        }
    };

    const removeFriend = (friendId) => {
        setFriends(currentFriends => currentFriends.filter(id => id !== friendId));
        setFriendCount(friendCount - 1)
    };

    const addThread = (thread) => {
        setThreads(currentThreads => [...currentThreads, { _id: thread._id, name: thread.name }])
        refreshUserData();
    };

    const removeThread = (threadId) => {
        setThreads(currentThreads => currentThreads.filter(thread => thread._id !== threadId));
    }

    return (
        <UserContext.Provider value={{ userId, threads, friends, friendCount, addFriend, removeFriend, addThread, removeThread }}>
            {children}
        </UserContext.Provider>
    );
};