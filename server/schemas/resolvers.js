const { User, MessageThread, Message, Question, Answer } = require('../models');
const { belongsToThread } = require('../utils/helpers');
const { signToken } = require('../utils/auth');
const bcrypt = require('bcrypt');
const { GraphQLError } = require('graphql');
const { server, io } = require('../server');
// added login, 
// updated addUser,

const resolvers = {
    Query: {
        users: async () => {
            try {
                const users = await User.find()
                    .populate('friends')
                    .populate('messageThreads')
                    .populate('answerChoices');
                // emits an event to the client to update the users in the UI
                // io.emit('users-fetched', users);
                return users;
            } catch(err) {
                throw new Error(`Error getting users: ${err}`);
            }
        },
        user: async (parent, { userId }, context) => {
            try {
                // if (!context.user) {
                //     throw AuthenticationError
                // }
                // const userId = context.user._id
                const user = await User.findById(userId)
                    .populate('friends')
                    .populate('messageThreads')
                    .populate('answerChoices')
                    .populate({ path: 'answerChoices', populate: 'questionId' });
                if (!user) {
                    throw new Error('No user with this id');
                }
                // emits an event to the client to update the user in the UI
                // io.emit('user-fetched', user);
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
                if (!context.user) {
                    throw AuthenticationError
                }
                const userId = context.user._id;
                const currentUser = await User.findById(userId).populate('friends').populate('messageThreads');
                // emits an event to the client to update the current user in the UI
                // io.emit('current-user-updated', currentUser);
                return currentUser;
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
                    // emits an event to the client to update the threads in the UI
                    // io.emit('threads-updated', threads);
                return threads;
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
                // emits an event to the client to update the thread in the UI
                // io.emit('thread-updated', thread);
                return thread;
            } catch(err) {
                throw new Error(`Error getting one thread: ${err}`);
            }
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new GraphQLError('User not found.');
                }
    
                const correctPw = await user.isCorrectPw(password);
    
                if (!correctPw) {
                    throw new GraphQLError('Incorrect password.');
                }
    
                const token = signToken(user);
                return { token, user: { _id: user._id, username: user.username, email: user.email } };
    
            } catch(err) {
                throw new Error(`Error logging in: ${err}`);
            }
        },

      
        addUser: async (parent, { username, email, password }) => {
            try {
                const newUser = (await User.create({ username, email, password }));
                const token = signToken(newUser);
                // emits an event to the client to add the new user to the UI
                // io.emit('user-added', newUser);
                return { token, user: newUser };
            } catch(err) {
                throw new Error(`Error adding a new user: ${err}`);
            }
        },
        updateUser: async (parent, { username, email, password }, context) => {
            try {
                  // uncomment to to use JWT
                let user = context.user 
                const userId = context.user._id
                
                // let user = await User.findById(userId); // comment out for JWT
                if (!user) {
                    throw new Error('You must login to update user');
                }
                if (password) {
                    password = await bcrypt.hash(password, 10);
                }
                user = await User.findByIdAndUpdate(
                    userId,
                    { username: username, email: email, password: password}, 
                    {new: true});

                // emits an event to the client to update the user in the UI
                // io.emit('user-updated', user);
                return user;
            } catch(err) {
                throw new Error(`Error updating user: ${err}`);
            }
        },
        deleteUser: async (parent, { userId }, context) => {
            try {
                // const user = await User.findById(context.user._id)

                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('Please login')
                }
                const messages = await Message.find({ sender: userId });
                const messageIds = messages.map(message => message._id);

                await Message.deleteMany({ sender: userId });
                await MessageThread.updateMany({}, { $pull: { messages: { $in: messageIds}}})
                await MessageThread.updateMany({ $pull: { participants: userId }})
                await User.updateMany({ $pull: { friends: userId }});
                // emits an event to the client to remove the deleted user from the UI
                // io.emit('user-deleted', userId);
                const deletedUser = await User.findByIdAndDelete(userId);
                return deletedUser;
            } catch(err) {
                throw new Error(`Error deleting user: ${err}`);
            }
        },
        createThread: async (parent, { userId, name }, context) => {
            try {
                // const user = context.user

                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('Please login or create an account to create a new thread')
                }
                const newThread = await MessageThread.create({ admin: /* context.user._id */ userId, name: name, participants: userId });

                await User.findByIdAndUpdate(
                    // context.user._id
                    userId, 
                    { $addToSet: { messageThreads: newThread._id }}, 
                    { new: true });

                // emits an event to the client to add the new thread to the UI
                // io.emit('thread-created', newThread);
                return await MessageThread.findById(newThread._id)
                    .populate('admin')
                    .populate('participants', 'username');
            } catch(err) {
                throw new Error(`Error creating new thread: ${err}`);
            }
        },
        deleteThread: async (parent, { threadId, userId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);

                if (!thread) {
                    throw new Error('Thread not found');
                }

                if (thread.admin.toString() !== userId /* context.user._id*/) {
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
                // emits an event to the client to remove the deleted thread from the UI
                // io.emit('thread-deleted', threadId);
                return deletedThread;
            } catch(err) {
                throw new Error(`Error deleting thread: ${err}`);
            }
        },
        updateThread: async (parent, { threadId, userId, name }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                if (thread.admin.toString() !== userId /* context.user._id*/) {
                    throw new Error(`You do not have permission to edit thread settings`)
                }

                const updatedThread = await MessageThread.findByIdAndUpdate(
                    threadId, 
                    { name: name }, 
                    { new: true })
                    .populate('messages');
                // emits an event to the client to update the thread in the UI with the new name
                // io.emit('thread-updated', updatedThread);
                return updatedThread;
            } catch(err) {
                throw new Error(`Error updating thread: ${err}`);
            }
        },
        addMessage: async (parent, { text, userId, threadId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                if (!thread) {
                    throw new Error('No thread with that id');
                }
                if (!belongsToThread(thread.participants, userId /* context.user._id*/)) {
                    throw new Error('You cannot message here until you join!')
                }
                const message = await Message.create({ text, sender: userId /* context.user._id*/, messageThread: threadId });
                
                const updatedThread = await MessageThread.findByIdAndUpdate(
                    threadId, 
                    { $addToSet: { messages: message }}, 
                    { new: true })
                    .populate({ path: 'messages', populate: { path: 'sender', select: 'username'}})
                    .populate('participants')
                    .populate('admin');

                // emits an event to the client to update the thread in the UI with the new message
                // io.emit('message-added', updatedThread);
                return updatedThread;
                
            } catch(err) {
                throw new Error(`Error adding new message: ${err}`);
            }
        },
        updateMessage: async (parent, { messageId, text, userId }, context) => {
            try {
                // const user = context.user;
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('You do not have permission to edit this message');
                }
                const updatedMessage = await Message.findByIdAndUpdate(
                    messageId, 
                    { text: text }, 
                    { new: true })
                    .populate('sender');

                // emits an event to the client to update the message in the UI with the new text
                // io.emit('message-updated', updatedMessage);
                return updatedMessage;
            } catch(err) {
                throw new Error(err);
            }
        },
        deleteMessage: async (parent, { messageId, userId }) => {
            try {
                const message = await Message.findById(messageId);
                if (message.sender.toString() !== userId) {
                    throw new Error('Error deleting message');
                }

                await MessageThread.findByIdAndUpdate(messageId, { $pull: { messages: messageId }}, { new: true });
                const deletedMessage = await Message.findByIdAndDelete(messageId);
                // emits an event to the client to delete the message from the UI
                // io.emit('message-deleted', deletedMessage);
                return deletedMessage;

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

                const updatedUser = await User.findByIdAndUpdate(
                    userId, 
                    { $addToSet: { friends: friendId }}, 
                    { new: true })
                    .populate('friends')

                // emits an event to the client to update the user in the UI with the new friend
                // io.emit('friend-added', updatedUser);
                return updatedUser;
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

                const updatedUser = await User.findByIdAndUpdate(
                    userId, 
                    { $pull: { friends: friendId } }, 
                    { new: true })
                    .populate('friends');
                // emits an event to the client to update the user in the UI with the friend removed
                // io.emit('friend-removed', updatedUser);
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

                const updatedThread = await MessageThread.findByIdAndUpdate(
                    threadId, 
                    { $addToSet: { participants: userId } }, 
                    { new: true }).populate('messages')
                    .populate('admin')
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender', select: 'username'}});

                // io.emit('user-joined-thread', updatedThread);
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

                const updatedUser = await User.findByIdAndUpdate(
                    userId, 
                    { $pull: { messageThreads: threadId }}, 
                    { new: true })
                    .populate('friends');

                // emits an event to the client to update the user in the UI with the thread removed from their messageThreads 
                //and the user removed from the thread's participants
                // io.emit('user-left-threat', {userId, threadId});
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

                await MessageThread.findByIdAndUpdate(
                    messageThread, 
                    { $push: { questions: newQuestion._id }}, 
                    { new: true });

                // emits an event to the client to update the thread in the UI with the new question
                // io.emit('question-added', newQuestion);
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

                const updatedQuestion = await Question.findByIdAndUpdate(
                    questionId, 
                    { text, option1, option2 }, 
                    { new: true })
                    .populate('creator')
                    .populate('messageThread');

                // emits an event to the client to update the question in the UI with the new text and options
                // io.emit('question-updated', updatedQuestion);
                return updatedQuestion;
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

                await MessageThread.findByIdAndUpdate(
                    question.messageThread, 
                    { $pull: { questions: questionId } }, 
                    { new: true });

                await Question.findByIdAndDelete(questionId);
                // emits an event to the client to delete the question from the UI
                // io.emit('question-deleted', questionId);
                return { message: 'successful deletion'};
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

                const question = await Question.findByIdAndUpdate(
                    questionId, 
                    { $push: { answers: newAnswer }}, 
                    { new: true })
                    .populate('messageThread')
                    .populate('creator')
                    .populate('answers')
                    .populate({ path: 'answers', populate: { path: 'userId', select: 'username' }});

                await User.findByIdAndUpdate(userId, { $push: { answerChoices: newAnswer._id }})
                // emits an event to the client to update the question in the UI with the new answer
                // io.emit('question-answered', question);
                return question;
            } catch (err) {
                throw new Error(`Error answering question: ${err}`);
            }
        }
    }
}

module.exports = resolvers;