const { User, MessageThread, Message, Question, Answer } = require('../models');
const { belongsToThread } = require('../utils/helpers');
const { signToken, AuthenticationError } = require('../utils/auth');
const bcrypt = require('bcrypt');

const resolvers = {
    Query: {
        users: async () => {
            try {
                return await User.find().populate('friends').populate('messageThreads').populate('answerChoices');
            } catch(err) {
                throw new Error(`Error getting users: ${err}`);
            }
        },
        user: async (parent, { userId }) => {
            try {
                const user = await User.findById(userId).populate('friends').populate('messageThreads').populate('answerChoices').populate({ path: 'answerChoices', populate: 'questionId' });
                if (!user) {
                    throw new Error('No user with this id');
                }
                return user
            } catch(err) {
                throw new Error(`Error getting one user: ${err}`);
            }
        },
        // -Brady possible modification to user for efficiency
        // user: async (parent, { userId }, context, info) => {
        //     try {
        //         const userQuery = User.findById(userId);
        
        //         // Determine if specific fields are requested and populate them conditionally
        //         const fields = info.fieldNodes[0].selectionSet.selections.map(field => field.name.value);
        //         if (fields.includes('friends')) {
        //             userQuery.populate('friends');
        //         }
        //         if (fields.includes('messageThreads')) {
        //             userQuery.populate('messageThreads');
        //         }
        //         if (fields.includes('answerChoices')) {
        //             userQuery.populate('answerChoices');
        //         }
        
        //         const user = await userQuery;
        //         if (!user) {
        //             throw new Error('No user with this id');
        //         }
        //         return user;
        //     } catch (err) {
        //         throw new Error(err);
        //     }
        // },
        me: async (parent, {}, context) => {
            try {
                const userId = context.user._id;
                if (userId) {
                    return await User.findById(userId);
                }
                throw AuthenticationError
            } catch(err) {
                throw new Error(`Error getting current user: ${err}`);
            }
        },
        threads: async () => {
            try {
                const threads = await MessageThread.find()
                    .populate({ path: 'messages', populate: { path: 'sender', select: 'username' }})
                    .populate('admin')
                    .populate('participants')
                    .populate('questions')
                    .populate({ path: 'questions', populate: 'creator' });
                return threads
            } catch(err) {
                throw new Error(`Error getting threads: ${err}`);
            }
        },
        thread: async (parent, { threadId }) => {
            try {
                const thread = await MessageThread.findById(threadId)
                    .populate('admin')
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });
                if (!thread) {
                    throw new Error('No thread with this id');
                }
                return thread
            } catch(err) {
                throw new Error(`Error getting one thread: ${err}`);
            }
        }
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            try {
                const newUser = await User.create({ username, email, password });
                return newUser
            } catch(err) {
                throw new Error(`Error adding a new user: ${err}`);
            }
        },
        updateUser: async (parent, { userId, username, email, password }) => {
            try {
                let user = await User.findById(userId);
                if (!user) {
                    throw new Error('No user with this id');
                }
                if (password) {
                    password = await bcrypt.hash(password, 10);
                }
                user = User.findByIdAndUpdate(userId,{ username: username, email: email, password: password}, {new: true});

                return user
            } catch(err) {
                throw new Error(`Error updating user: ${err}`);
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
                
                const deletedUser = await User.findByIdAndDelete(userId);

                return deletedUser
            } catch(err) {
                throw new Error(`Error deleting user: ${err}`);
            }
        },
        createThread: async (parent, { userId, name }) => {
            try {

                /* checks for a logged in user will be done with JWTs later on */

                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('Please login or create an account to create a thread')
                }
                const newThread = await MessageThread.create({ admin: userId, name: name, participants: userId });
                await User.findByIdAndUpdate(userId, { $addToSet: { messageThreads: newThread._id }}, { new: true });
                return await MessageThread.findById(newThread._id).populate('admin').populate('participants', 'username');
            } catch(err) {
                throw new Error(`Error creating new thread: ${err}`);
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

                const deletedThread = await MessageThread.findByIdAndDelete(threadId);
                
                return deletedThread;
            } catch(err) {
                throw new Error(`Error deleting thread: ${err}`);
            }
        },
        updateThread: async (parent, { threadId, userId, name }) => {
            try {
                const thread = await MessageThread.findById(threadId);
                if (thread.admin.toString() !== userId) {
                    throw new Error(`You do not have permission to edit thread settings`)
                }

                const updatedThread = await MessageThread.findByIdAndUpdate(threadId, { name: name }, { new: true }).populate('messages')

                return updatedThread;
            } catch(err) {
                throw new Error(`Error updating thread: ${err}`);
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
                const updatedThread = await MessageThread.findByIdAndUpdate(threadId, { $addToSet: { messages: message }}, { new: true }).populate({ path: 'messages', populate: { path: 'sender', select: 'username'}}).populate('participants').populate('admin');
                return updatedThread;
                
            } catch(err) {
                throw new Error(`Error adding new message: ${err}`);
            }
        },
        updateMessage: async (parent, { messageId, text, userId }) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('You do not have permission to edit this message');
                }
                const updatedMessage = await Message.findByIdAndUpdate(messageId, { text: text }, { new: true }).populate('sender');
                return updatedMessage;
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
                const deletedMessage = await Message.findByIdAndDelete(messageId);
                return deletedMessage

            } catch(err) {
                throw new Error(`Error deleting message: ${err}`);
            }
        },
        addFriend: async (parent, { userId, friendId }) => {
            try {
                const user = await User.findById(userId);
                const friend = await User.findById(friendId);
                if (!user || !friend) {
                    throw new Error('Please login or try a different friend')
                }

                const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId }}, { new: true }).populate('friends')
                return updatedUser
            } catch(err) {
                throw new Error(`Error adding friend: ${err}`);
            }
        },
        removeFriend: async (parent, { userId, friendId }, context) => {
            try {
                const user = await User.findById(userId);
                const friend = await User.findById(friendId);
                if (!user || !friend) {
                    throw new Error('Please login or try a different friend')
                }

                const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true }).populate('friends');
                return updatedUser;
            } catch(err) {
                throw new Error(`Error removing friend: ${err}`);
            }
        },
        joinThread: async (parent, { userId, threadId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                // logged in users will be handled with JWTs later on
                const user = await User.findById(userId);
                if (!thread || !user) {
                    throw new Error('Please login or try a different thread')
                }
                await User.findByIdAndUpdate({_id: userId}, { $addToSet: { messageThreads: thread._id } });
                const updatedThread = await MessageThread.findByIdAndUpdate(threadId, { $addToSet: { participants: userId } }, { new: true }).populate('messages').populate('admin').populate('participants').populate({ path: 'messages', populate: { path: 'sender', select: 'username'}});
                return updatedThread;
            } catch(err) {
                throw new Error('Error joining thread', err)
            }
        },
        leaveThread: async (parent, { threadId, userId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                const user = await User.findById(userId);
                if (!user || !thread) {
                    throw new Error('You cannot perform this action')
                }
                await MessageThread.findByIdAndUpdate(threadId , { $pull: { participants: userId }})

                const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { messageThreads: threadId }}, { new: true }).populate('friends');
                return updatedUser;
                
            } catch(err) {
                throw new Error(`Error leaving thread: ${err}`);
            }
        },
        createQuestion: async (parent, { userId, messageThread, text, option1, option2 }, context) => {
            try {
                const thread = await MessageThread.findById(messageThread);
                if (!thread) {
                    throw new Error('No thread with this id')
                }
                const newQuestion = await Question.create({ creator: userId, messageThread, text, option1, option2 });
                await MessageThread.findByIdAndUpdate(messageThread, { $push: { questions: newQuestion._id }}, { new: true });
                return await Question.findById(newQuestion._id).populate('messageThread').populate('creator');
            } catch(err) {
                throw new Error(`Error creating question: ${err}`)
            }
        },
        updateQuestion: async (parent, { userId, questionId, text, option1, option2 }) => {
            try {
                const question = await Question.findById(questionId);

                if (!question) {
                    throw new Error('No question with this id');
                }
                if (question.creator.toString() !== userId) {
                    throw new Error('You do not have authorization to edit this question');
                }

                const updatedQuestion = await Question.findByIdAndUpdate(questionId, { text, option1, option2 }, { new: true }).populate('creator').populate('messageThread');
                return updatedQuestion
            } catch(err) {
                throw new Error(`Error editing question: ${err}`)
            }
        },
        deleteQuestion: async (parent, { userId, questionId }, context) => {
            try {
                const question = await Question.findById(questionId);
                if (question.creator.toString() !== userId) {
                    throw new Error('You cannot perform this action')
                }
                await Answer.deleteMany({ questionId: questionId })
                await MessageThread.findByIdAndUpdate(question.messageThread, { $pull: { questions: questionId } }, { new: true });
                await Question.findByIdAndDelete(questionId);
                return { message: 'successful deletion'}
            } catch (err) {
                throw new Error(`Error deleting question: ${err}`);
            }
        },
        answerQuestion: async (parent, { userId, questionId, answer }, context) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('Please login to answer question');
                }
                const newAnswer = await Answer.create({ userId, questionId, answerChoice: answer })
                const question = await Question.findByIdAndUpdate(questionId, { $push: { answers: newAnswer }}, { new: true }).populate('messageThread').populate('creator').populate('answers').populate({ path: 'answers', populate: { path: 'userId', select: 'username' }});
                await User.findByIdAndUpdate(userId, { $push: { answerChoices: newAnswer._id }})
                return question;
            } catch (err) {
                throw new Error(`Error answering question: ${err}`);
            }
        }
    }
}

module.exports = resolvers;