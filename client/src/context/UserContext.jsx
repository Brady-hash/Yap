import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_MAIN_POLL } from '../utils/queries';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [friendCount, setFriendCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [threads, setThreads] = useState([]);
    const [mainPoll, setMainPoll] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(QUERY_ME);
    const { data: mainPollData, loading: mainPollLoading, refetch: refetchPoll } = useQuery(QUERY_MAIN_POLL);

    useEffect(() => {
        if (!userLoading && userData && userData.me) {
            setFriends(userData.me.friends || []);
            setUserId(userData.me._id);
            setThreads(userData.me.messageThreads || []);
            setFriendCount(userData.me.friendCount || 0);
        }
    }, [userData, userLoading]);

    useEffect(() => {
        if (!mainPollLoading && mainPollData && mainPollData.mainPoll) {
            const mainPoll = mainPollData.mainPoll;
            setMainPoll(mainPoll);

            // Check if the user has already answered the main poll
            const userAnswer = mainPoll.answers.find(answer => answer.userId?._id === userId);
            if (userAnswer) {
                setHasAnswered(true);
                setSelectedOption(userAnswer.answerChoice);
            } else {
                setHasAnswered(false);
                setSelectedOption(null);
            }
        }
    }, [mainPollData, mainPollLoading, userId]);

    const refreshUserData = async () => {
        try {
            await refetchUser();
            await refetchPoll(); 
        } catch (error) {
            console.error("Failed to refetch data:", error);
        }
    };

    const addFriend = (friendId) => {
        if (!friends.some(friend => friend._id === friendId)) {
            setFriends(currentFriends => [...currentFriends, friendId]);
            setFriendCount(friendCount + 1);
        }
    };

    const removeFriend = (friendId) => {
        setFriends(currentFriends => currentFriends.filter(id => id !== friendId));
        setFriendCount(friendCount - 1);
    };

    const addThread = (thread) => {
        setThreads(currentThreads => [...currentThreads, { _id: thread._id, name: thread.name }]);
        refreshUserData();
    };

    const removeThread = (threadId) => {
        setThreads(currentThreads => currentThreads.filter(thread => thread._id !== threadId));
    };

    return (
        <UserContext.Provider value={{
            userId,
            threads,
            friends,
            friendCount,
            mainPoll,
            hasAnswered,
            selectedOption,
            addFriend,
            removeFriend,
            addThread,
            removeThread,
            refreshUserData
        }}>
            {children}
        </UserContext.Provider>
    );
};
