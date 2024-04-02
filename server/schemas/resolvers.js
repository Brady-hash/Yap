const { User, MessageThread, Message } = require('../models');
const { belongsToThread } = require('../utils/helpers');
const bcrypt = require('bcrypt')

const resolvers = {
    Query: {
        users: async () => {
            try {
                return await User.find().populate('friends').populate('messageThreads');
            } catch(err) {
                throw new Error(err);
            }
        },
        user: async (parent, { userId }) => {
            try {
                const user = await User.findById(userId).populate('friends').populate('messageThreads');
                if (!user) {
                    throw new Error('No user with this id')
                }
                return user
            } catch(err) {
                throw new Error(err);
            }
        },
        threads: async () => {
            try {
                return await MessageThread.find().populate({ path: 'messages', populate: { path: 'sender', select: 'username' }}).populate('admin').populate('participants');
            } catch(err) {
                throw new Error(err)
            }
        },
        thread: async (parent, { threadId }) => {
            try {
                const thread = await MessageThread.findById(threadId).populate('admin').populate('participants').populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }});
                if (!thread) {
                    throw new Error('No thread with this id')
                }
                return thread
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            try {
                return await User.create({ username, email, password });
            } catch(err) {
                throw new Error(err);
            }
        },
        updateUser: async (parent, { userId, username, email, password }) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('No user with this id');
                }
                if (password) {
                    password = await bcrypt.hash(password, 10);
                }
                return await User.findByIdAndUpdate(userId,{ username: username, email: email, password: password}, {new: true});
            } catch(err) {
                throw new Error(err);
            }
        },
        deleteUser: async (parent, { userId }) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('No user found with this id')
                }
                const messages = await Message.find({ sender: userId });
                const messageIds = messages.map(message => message._id);

                await Message.deleteMany({ sender: userId });
                await MessageThread.updateMany({}, { $pull: { messages: { $in: messageIds}}})
                await MessageThread.updateMany({ $pull: { participants: userId }})
                await User.updateMany({ $pull: { friends: userId }});

                return await User.findByIdAndDelete(userId);
            } catch(err) {
                throw new Error(err)
            }
        },
        createThread: async (parent, { userId, name }) => {
            try {

                /* checks for a logged in user will be done with JWTs later on */

                const user = await User.findById(userId);
                if (user) {
                    const newThread = await MessageThread.create({ admin: userId, name: name, participants: userId });
                    await User.findByIdAndUpdate(userId, { $addToSet: { messageThreads: newThread._id }}, { new: true });
                    return await MessageThread.findById(newThread._id).populate('admin').populate('participants', 'username');
                }
                throw new Error('Please login or create an account to create a thread')
            } catch(err) {
                throw new Error(err);
            }
        },
        deleteThread: async (parent, { threadId, userId }) => {
            try {
                const thread = await MessageThread.findById(threadId);
                if (thread.admin.toString() === userId ) {
                    await Message.deleteMany({ messageThread: threadId });
                    await User.updateMany({ $pull: { messageThreads: threadId }})
                    return await MessageThread.findByIdAndDelete(threadId)
                }
                throw new Error('Error deleting thread');
            } catch(err) {
                throw new Error(err);
            }
        },
        updateThread: async (parent, { threadId, userId, name }) => {
            try {
                const thread = await MessageThread.findById(threadId);
                if (thread.admin.toString() === userId) {
                    return await MessageThread.findByIdAndUpdate(threadId, { name: name }, { new: true }).populate('messages')
                }
            } catch(err) {
                throw new Error(err);
            }
        },
        addMessage: async (parent, { text, userId, threadId }) => {
            try {
                const thread = await MessageThread.findById(threadId);
                if (!thread) {
                    throw new Error('No thread with that id');
                }
                if (!belongsToThread(thread.participants, userId)) {
                    throw new Error('You cannot message here until you join!')
                }
                const message = await Message.create({ text, sender: userId, messageThread: threadId });
                return await MessageThread.findByIdAndUpdate(threadId, { $addToSet: { messages: message }}, { new: true }). populate({ path: 'messages', populate: { path: 'sender', select: 'username'}}).populate('participants').populate('admin')
                
            } catch(err) {
                throw new Error(err)
            }
        },
        updateMessage: async (parent, { messageId, text, userId }) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('You do not have permission to update this message');
                }
                return await Message.findByIdAndUpdate(messageId, { text: text }, { new: true }).populate('sender');
            } catch(err) {
                throw new Error(err);
            }
        },
        deleteMessage: async (parent, { messageId, userId }) => {
            try {
                if (messageId.sender.toString() === userId) {
                    return await Message.findByIdAndDelete(messageId);
                }
                throw new Error('Error deleting message');
            } catch(err) {
                throw new Error(err);
            }
        },
        addFriend: async (parent, { userId, friendId }) => {
            try {
                const user = await User.findById(userId);
                const friend = await User.findById(friendId);
                if (!user || !friend) {
                    throw new Error('Please login or try a different friend')
                }
                return await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId }}, { new: true }).populate('friends')
            } catch(err) {
                throw new Error(err);
            }
        },
        removeFriend: async (parent, { userId, friendId }) => {
            try {
                const user = await User.findById(userId);
                const friend = await User.findById(friendId);
                if (!user || !friend) {
                    throw new Error('Please login or try a different friend')
                }
                return await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true }).populate('friends');
            } catch(err) {
                throw new Error(err);
            }
        },
        joinThread: async (parent, { userId, threadId }) => {
            const thread = await MessageThread.findById(threadId);
            // logged in users will be handled with JWTs later on
            const user = await User.findById(userId);
            if (!thread || !user) {
                throw new Error('Please login or try a different thread')
            }
            await User.findByIdAndUpdate({_id: userId}, { $addToSet: { messageThreads: thread._id } });
            return await MessageThread.findByIdAndUpdate(threadId, { $addToSet: { participants: userId } }, { new: true }).populate('messages').populate('participants');
        },
        leaveThread: async (parent, { threadId, userId }) => {
            try {
                const thread = await MessageThread.findById(threadId);
                const user = await User.findById(userId);
                if (!user || !thread) {
                    throw new Error('You cannot perform this action')
                }
                await MessageThread.findByIdAndUpdate(threadId , { $pull: { participants: userId }})
                return await User.findByIdAndUpdate(userId, { $pull: { messageThreads: threadId }}, { new: true }).populate('');
                
            } catch(err) {
                throw new Error('Error leaving thread');
            }
        }
    }
}

module.exports = resolvers;