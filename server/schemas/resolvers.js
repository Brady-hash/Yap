const { User, MessageThread, Message, Question, Answer } = require('../models');
const { belongsToThread } = require('../utils/helpers');
const { signToken, AuthenticationError } = require('../utils/auth');
const bcrypt = require('bcrypt');
const { GraphQLError } = require('graphql');

require('dotenv').config({ path: '../.env'})
const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

const threadsIndex = client.initIndex('threadsIndex');
const usersIndex = client.initIndex('usersIndex');

const { server, io } = require('../server');
const { populate } = require('../models/User');
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
                io.emit('users-fetched', users);
                return users;
            } catch(err) {
                throw new Error(`Error getting users: ${err}`);
            }
        },
        user: async (parent, { userId }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('Please login')
                }
                const userId = context.user._id
                const user = await User.findById(userId)
                    .populate('friends')
                    .populate('messageThreads')
                    .populate('answerChoices')
                    .populate({ path: 'answerChoices', populate: 'questionId' });
                if (!user) {
                    throw new Error('No user with this id');
                }
                // emits an event to the client to update the user in the UI
                io.emit('user-fetched', user);
                return user;
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
                    throw new AuthenticationError ('Please login')
                }
                const userId = context.user._id;
                const currentUser = await User.findById(userId).populate('friends').populate('messageThreads');
                // emits an event to the client to update the current user in the UI
                io.emit('current-user-updated', currentUser);
                return currentUser;
            } catch(err) {
                throw new Error(`Error getting current user: ${err}`);
            }
        },
        threads: async () => {
            try {
                const threads = await MessageThread.find()
                    .populate({ path: 'messages', populate: { path: 'sender', select: 'username' }})
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate('questions')
                    .populate({ path: 'questions', populate: 'creator' });
                    const { socket} = context;
                    // emits an event to the client to update the threads in the UI 
                    if (socket) {
                        socket.emit('threads-updated', threads);
                    }
                return threads;
            } catch(err) {
                throw new Error(`Error getting threads: ${err}`);
            }
        },
        thread: async (parent, { threadId }) => {
            try {
                const thread = await MessageThread.findById(threadId)
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });
                if (!thread) {
                    throw new Error('No thread with this id');
                }
                // emits an event to the client to update the thread in the UI
                // io.emit('thread-updated', thread);
                // console.log(thread)
                io.emit('thread-updated', thread);
                console.log(thread)
                return thread;
            } catch(err) {
                throw new Error(`Error getting one thread: ${err}`);
            }
        },
        mainPoll: async () => {
            try {
                // Assume we have a method to find the main poll; you might need to adjust this logic
                // depending on how you determine which poll is the main one.
                const mainPoll = await Question.findOne({ isMainPoll: true });
                if (!mainPoll) {
                    throw new Error('Main poll not found');
                }
                return mainPoll;
            } catch (err) {
                throw new Error(`Error fetching main poll: ${err}`);
            }
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({ email }).populate('friends').populate('messageThreads');
                if (!user) {
                    throw new GraphQLError('User not found.');
                }
    
                const correctPw = await user.isCorrectPw(password);

                if (!correctPw) {
                    throw new GraphQLError('Incorrect password.');
                }
    
                const token = signToken(user);
                return { token, user: { _id: user._id, username: user.username, email: user.email, friends: user.friends, messageThreads: user.messageThreads } };
    
            } catch(err) {
                throw new Error(`Error logging in: ${err}`);
            }
        },      
        addUser: async (parent, { username, email, password }) => {
            try {
                const newUser = await User.create({ username, email, password });
                const token = signToken(newUser);
                // emits an event to the client to add the new user to the UI
                // io.emit('user-added', newUser);
                const algoliaUserData = {
                    objectID: newUser._id.toString(),
                    username: newUser.username
                };
                // for adding users to search index
                await usersIndex.saveObject(algoliaUserData).then(() => {
                    console.log('User added to algolia')
                }).catch(err => console.log('Failed to add user to algolia index', err))

                io.emit('user-added', newUser);
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

                //updating users in algolia
                usersIndex.partialUpdateObject({
                    objectID: user._id, 
                    username: user.username,
                }).then(() => {
                    console.log('User updated in Algolia');
                }).catch(err => {
                    console.error('Failed to update user in Algolia index', err);
                });
                io.emit('user-updated', user);
                return user;
            } catch(err) {
                throw new Error(`Error updating user: ${err}`);
            }
        },
        deleteUser: async (parent, { userId }, context) => {
            try {
                if (!context.user._id) {
                    throw AuthenticationError
                }
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

                // removing users from algolia search
                await usersIndex.deleteObject(user._id.toString()).then(() => {
                    console.log('User deleted from Algolia');
                }).catch(err => console.error('Failed to delete user from Algolia index', err))

                io.emit('user-deleted', userId);
                const deletedUser = await User.findByIdAndDelete(userId);
                return deletedUser;
            } catch(err) {
                throw new Error(`Error deleting user: ${err}`);
            }
        },
        createThread: async (parent, { userId, name, participantUsernames}, context) => {
            try {
                // const user = context.user
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('Please login or create an account to create a new thread')
                }

                const participants = await User.find({
                    username: { $in: participantUsernames }
                });
                if (participants.length !== participantUsernames.length) {
                    throw new Error('Some usernames do not exist');
                }

                const participantIds = participants.map(user => user._id);

                if (!participantIds.includes(userId)) {
                    participantIds.push(userId);
                }

                const newThread = await MessageThread.create({ 
                    name: name,
                    admins: [userId], 
                    creator: userId,
                    participants: participantIds 
                });

                for (const participantId of participantIds) {
                    await User.findByIdAndUpdate(
                        participantId,
                        { $addToSet: { messageThreads: newThread._id }},
                        { new: true }
                    );
                }


                // emits an event to the client to add the new thread to the UI
                // io.emit('thread-created', newThread);

                // adding thread to algolia search
                const algoliaThreadData = {
                    objectID: newThread._id.toString(),
                    name: newThread.name
                };

                await threadsIndex.saveObject(algoliaThreadData).then(() => {
                    console.log('Thread added to algolia')
                }).catch(err => console.log('Failed to add thread to algolia index', err))


                io.emit('thread-created', newThread);
                return await MessageThread.findById(newThread._id)
                    .populate('creator')
                    .populate('admins')
                    .populate('participants');

            } catch(err) {
                throw new Error(`Error creating new thread: ${err}`);
            }
        },
        deleteThread: async (parent, { threadId }, context) => {
            try {
                if (!context.user) {
                    throw AuthenticationError
                }
                const thread = await MessageThread.findById(threadId);

                if (!thread) {
                    throw new Error('Thread not found');
                }

                // if (thread.creator.toString() !== context.user._id) {
                //     throw AuthenticationError
                // }

                const questions = await Question.find({ messageThread: threadId });
                questions.forEach(async question => {
                    await Answer.deleteMany({ questionId: question._id });
                })
                
                await Question.deleteMany({ messageThread: threadId });
                await Message.deleteMany({ messageThread: threadId });
                await User.updateMany({ $pull: { messageThreads: threadId }});

                // removing thread from algolia search
                await threadsIndex.deleteObject(thread._id.toString()).then(() => {
                    console.log('Thread deleted from Algolia');
                }).catch(err => console.error('Failed to delete thread from Algolia index', err))

                const deletedThread = await MessageThread.findByIdAndDelete(threadId);
                // emits an event to the client to remove the deleted thread from the UI
                // io.emit('thread-deleted', threadId);
                return { message: 'success' }
                io.emit('thread-deleted', threadId);
                return deletedThread;
            } catch(err) {
                throw new Error(`Error deleting thread: ${err}`);
            }
        },
        updateThread: async (parent, { threadId, name }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                // if (thread.creator.toString() !== context.user._id) {
                //     throw AuthenticationError
                // }

                const updatedThread = await MessageThread.findByIdAndUpdate(
                    threadId, 
                    { name: name }, 
                    { new: true })
                    .populate({ path: 'messages', populate: { path: 'sender', select: 'username' }})
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate('questions')
                    .populate({ path: 'questions', populate: 'creator' });
                    .populate('messages');
                    if (!updatedThread) {
                        throw new Error('No thread with this id');
                    }
                if (socket) {
                // emits an event to the client to update the thread in the UI with the new name
                // io.emit('thread-updated', updatedThread);

                // updating thread in algolia search
                threadsIndex.partialUpdateObject({
                    objectID: threadId, 
                    name: updatedThread.name,
                }).then(() => {
                    console.log('Thread updated in Algolia');
                }).catch(err => {
                    console.error('Failed to update thread in Algolia index', err);
                });
                socket.emit('thread-updated', updatedThread);
                }
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
                    .populate({ path: 'admins', select: 'username'})
                if (socket) {
                // emits an event to the client to update the thread in the UI with the new message
                socket.emit('message-added', updatedThread);
                }
                return updatedThread;
                
            } catch(err) {
                throw new Error(`Error adding new message: ${err}`);
            }
        },
        updateMessage: async (parent, { messageId, text, userId }, context) => {
            try {
                const user = context.user;
                // const user = await User.findById(userId);
                if (!user) {
                    throw new Error('You do not have permission to edit this message');
                }
                const updatedMessage = await Message.findByIdAndUpdate(
                    messageId, 
                    { text: text }, 
                    { new: true })
                    .populate('sender');
                if (socket) {
                // emits an event to the client to update the message in the UI with the new text
                socket.emit('message-updated', updatedMessage);
                }
                return updatedMessage;
            } catch(err) {
                throw new Error(err);
            }
        },
        deleteMessage: async (parent, { messageId, userId }, context) => {
            try {
                // if (!context.user) throw AuthenticationError
                // const userId = context.user._id

                const message = await Message.findById(messageId);

                await MessageThread.findByIdAndUpdate(message.messageThread, { $pull: { messages: messageId }}, { new: true });
                await Message.findByIdAndDelete(messageId);
                if (socket) {
                // emits an event to the client to delete the message from the UI
                socket.emit('message-deleted', deletedMessage);
                }
                return { message: 'success' }

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
                if (socket) {
                // emits an event to the client to update the user in the UI with the new friend
                socket.emit('friend-added', updatedUser);
                }
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
                if (socket) {
                // emits an event to the client to update the user in the UI with the friend removed
                socket.emit('friend-removed', updatedUser);
                }
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
                    .populate('admins')
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender', select: 'username'}});
                if (socket) {
                    // emits an event to the client to update the thread in the UI with the new participant
                socket.emit('user-joined-thread', updatedThread);
                }
                return updatedThread;
            } catch(err) {
                throw new Error('Error joining thread', err)
            }
        },
        leaveThread: async (parent, { threadId }, context) => {
            try {
                if (!context.user) {
                 throw AuthenticationError   
                }
                const userId = context.user._id
                const thread = await MessageThread.findById(threadId);
                if (!thread) {
                    throw new Error('no thread found with this id')
                }
                await MessageThread.findByIdAndUpdate(threadId , { $pull: { participants: userId, admins: userId }})

                await User.findByIdAndUpdate(
                    userId, 
                    { $pull: { messageThreads: threadId }}, 
                    { new: true })
                    .populate('friends');
                if (socket) {
                // emits an event to the client to update the user in the UI with the thread removed from their messageThreads 
                //and the user removed from the thread's participants
                // io.emit('user-left-threat', {userId, threadId});
                return {message: 'success' };
                socket.emit('user-left-threat', {userId, threadId});
                }
                return updatedUser;
                
            } catch(err) {
                throw new Error(`Error leaving thread: ${err}`);
            }
        },
        createQuestion: async (parent, { messageThread, text, option1, option2 }, context) => {
            try {
                if (!context.user) {
                    throw AuthenticationError
                }
                const thread = await MessageThread.findById(messageThread);
                if (!thread) {
                    throw new Error('No thread with this id')
                }
                const newQuestion = await Question.create({ creator: context.user._id, messageThread, text, option1, option2 });

                    await MessageThread.findByIdAndUpdate(
                    messageThread, 
                    { $push: { questions: newQuestion._id }}, 
                    { new: true })
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });

                // emits an event to the client to update the thread in the UI with the new question
                // io.emit('question-added', newQuestion);
                if (socket) {
                // emits an event to the client to update the thread in the UI with the new question
                // io.emit('question-added', newQuestion);
      
                socket.emit('question-added', newQuestion);
                }
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
                if (socket) {
                // emits an event to the client to update the question in the UI with the new text and options
                socket.emit('question-updated', updatedQuestion);
                }
                return updatedQuestion;
            } catch(err) {
                throw new Error(`Error editing question: ${err}`)
            }
        },
        deleteQuestion: async (parent, { userId, questionId }, context) => {
            try {
                const question = await Question.findById(questionId);
                if (!context.user) {
                    throw AuthenticationError
                }
                await Answer.deleteMany({ questionId: questionId })

                await MessageThread.findByIdAndUpdate(
                    question.messageThread, 
                    { $pull: { questions: questionId } }, 
                    { new: true });


                const deletedQuestion = await Question.findByIdAndDelete(questionId);
                // emits an event to the client to delete the question from the UI
                // io.emit('question-deleted', questionId);
                

                await Question.findByIdAndDelete(questionId);
                if (socket) {
                // emits an event to the client to delete the question from the UI
                socket.emit('question-deleted', questionId);
                }
                return deletedQuestion;

            } catch (err) {
                throw new Error(`Error deleting question: ${err}`);
            }
        },
        answerQuestion: async (parent, { userId, questionId, answer }, context) => {
            try {
                if (!context.user) {
                    throw AuthenticationError;
                }
                const userId = context.user._id
                const newAnswer = await Answer.create({ userId, questionId, answerChoice: answer });

                const question = await Question.findById(questionId).populate({ path: 'answers', populate: { path: 'userId', select: '_id'}});

                const hasAnswered = question.answers.some(ans => ans.userId._id.toString() === userId);

                if (hasAnswered) {
                    throw new Error(`You have already submitted an answer to this poll!`);
                }

                let update = { $addToSet: { answers: newAnswer._id } };
                if (answer === 'option1') {
                    update.$inc = { option1Count: 1 };
                } else if (answer === 'option2') {
                    update.$inc = { option2Count: 1 };
                } else {
                    throw new Error('Invalid answer option');
                }


                const updatedQuestion = await Question.findByIdAndUpdate(
                    questionId, 
                    update, 
                    { new: true })
                    .populate('messageThread')
                    .populate('creator')
                    .populate('answers')
                    .populate({ path: 'answers', populate: { path: 'userId', select: 'username' }});

                await User.findByIdAndUpdate(userId, { $push: { answerChoices: newAnswer._id }})
                if (socket) {
                // emits an event to the client to update the question in the UI with the new answer
                // io.emit('question-answered', question);
                
                return updatedQuestion;
                socket.emit('question-answered', question);
                }
                return question;
            } catch (err) {
                throw new Error(`Error answering question: ${err}`);
            }
        },
        adminUser: async (parent, { threadId, userId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                // if(!context.user || context.user._id !== thread.creator) {
                //     throw AuthenticationError
                // }

                const updatedThread = await MessageThread.findByIdAndUpdate(threadId, { $addToSet: { admins: userId }}, { new: true })
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });

                return updatedThread

            } catch(err) {
                throw new Error(`Error adding user to admin list: ${err}`);
            }
        },
        removeAdmin: async (parent, { userId, threadId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                // if(!context.user || context.user._id !== thread.creator) {
                //     throw AuthenticationError
                // }

                const updatedThread = await MessageThread.findByIdAndUpdate(threadId, { $pull: { admins: userId }}, { new: true })
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });

                return updatedThread
            } catch(err) {
                throw new Error(`Error removing admin: ${err}`);
            }
        }
    }
}

module.exports = resolvers;