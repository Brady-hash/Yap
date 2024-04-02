const { User, MessageThread, Message, Question, Answer } = require('../models');
const { belongsToThread } = require('../utils/helpers');
const { signToken, AuthenticationError } = require('../utils/auth')
const bcrypt = require('bcrypt')

const resolvers = {
    Query: {
        users: async () => {
            try {
                return await User.find().populate('friends').populate('messageThreads').populate('answerChoices');
            } catch(err) {
                throw new Error(err);
            }
        },
        user: async (parent, { userId }) => {
            try {
                const user = await User.findById(userId).populate('friends').populate('messageThreads').populate('answerChoices');
                if (!user) {
                    throw new Error('No user with this id')
                }
                return user
            } catch(err) {
                throw new Error(err);
            }
        },
        me: async (parent, {}, context) => {
            const userId = context.user._id;
            if (userId) {
                return await User.findById(userId);
            }
            throw AuthenticationError
        },
        threads: async () => {
            try {
                return await MessageThread.find().populate({ path: 'messages', populate: { path: 'sender', select: 'username' }}).populate('admin').populate('participants').populate('questions').populate({ path: 'questions', populate: 'creator' });
            } catch(err) {
                throw new Error(err)
            }
        },
        thread: async (parent, { threadId }) => {
            try {
                const thread = await MessageThread.findById(threadId).populate('admin').populate('participants').populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }}).populate({ path: 'questions', populate: 'creator' });
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

                if (!thread) {
                    throw new Error('Thread not found');
                }

                if (thread.admin.toString() !== userId) {
                    throw new Error('User not authorized to delete this thread');
                }

                const questions = await Question.find({ messageThread: threadId });
                questions.forEach(async question => {
                    await Answer.deleteMany({ questionId: question._id });
                })
                
                await Question.deleteMany({ messageThread: threadId });
                await Message.deleteMany({ messageThread: threadId });
                await User.updateMany({ $pull: { messageThreads: threadId }});
                
                return await MessageThread.findByIdAndDelete(threadId)
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
                return await MessageThread.findByIdAndUpdate(threadId, { $addToSet: { messages: message }}, { new: true }).populate({ path: 'messages', populate: { path: 'sender', select: 'username'}}).populate('participants').populate('admin').populate({ path: 'questions', populate: 'creator' });
                
            } catch(err) {
                throw new Error(err)
            }
        },
        updateMessage: async (parent, { messageId, text, userId }) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('You do not have permission to edit this message');
                }
                return await Message.findByIdAndUpdate(messageId, { text: text }, { new: true }).populate('sender');
            } catch(err) {
                throw new Error(err);
            }
        },
        deleteMessage: async (parent, { messageId, userId }) => {
            try {
                const message = await Message.findById(messageId);
                console.log(message.sender.toString())
                console.log(userId)
                if (message.sender.toString() !== userId) {
                    throw new Error('Error deleting message');
                }

                await MessageThread.findByIdAndUpdate(messageId, { $pull: { messages: messageId }}, { new: true });
                return Message.findByIdAndDelete(messageId);

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
        removeFriend: async (parent, { userId, friendId }, context) => {
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
        joinThread: async (parent, { userId, threadId }, context) => {
            const thread = await MessageThread.findById(threadId);
            // logged in users will be handled with JWTs later on
            const user = await User.findById(userId);
            if (!thread || !user) {
                throw new Error('Please login or try a different thread')
            }
            await User.findByIdAndUpdate({_id: userId}, { $addToSet: { messageThreads: thread._id } });
            return await MessageThread.findByIdAndUpdate(threadId, { $addToSet: { participants: userId } }, { new: true }).populate('messages').populate('participants').populate({ path: 'messages', populate: { path: 'sender', select: 'username'}});
        },
        leaveThread: async (parent, { threadId, userId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                const user = await User.findById(userId);
                if (!user || !thread) {
                    throw new Error('You cannot perform this action')
                }
                await MessageThread.findByIdAndUpdate(threadId , { $pull: { participants: userId }})
                return await User.findByIdAndUpdate(userId, { $pull: { messageThreads: threadId }}, { new: true }).populate('friends');
                
            } catch(err) {
                throw new Error('Error leaving thread');
            }
        },
        createQuestion: async (parent, { userId, messageThread, text, option1, option2 }, context) => {
            try {
                const thread = await MessageThread.findById(messageThread);
                if (!thread) {
                    throw new Error('No thread with this id')
                }
                const question = await Question.create({ creator: userId, messageThread, text, option1, option2 });
                await MessageThread.findByIdAndUpdate(messageThread, { $push: { questions: question._id }}, { new: true });
                return await Question.findById(question._id).populate('messageThread').populate('creator');
            } catch(err) {
                throw new Error('Error creating question', err)
            }
        },
        deleteQuestion: async (parent, { userId, questionId }, context) => {
            const question = await Question.findById(questionId);
            console.log(question.creator.toString())
            console.log(userId)
            if (question.creator.toString() !== userId) {
                throw new Error('You cannot perform this action')
            }
            await Answer.deleteMany({ questionId: questionId })
            await MessageThread.findByIdAndUpdate(question.messageThread, { $pull: { questions: questionId } }, { new: true });
            return await Question.findByIdAndDelete(questionId);
        },
        answerQuestion: async (parent, { userId, questionId, answer }, context) => {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('Please login to answer question');
            }
            const newAnswer = await Answer.create({ userId, questionId, answerChoice: answer })
            const question = await Question.findByIdAndUpdate(questionId, { $push: { answers: newAnswer }}, { new: true }).populate('messageThread').populate('creator').populate('answers').populate({ path: 'answers', populate: { path: 'userId', select: 'username' }});
            return question;
        }
    }
}

module.exports = resolvers;