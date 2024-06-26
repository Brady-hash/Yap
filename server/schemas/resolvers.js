const { User, MessageThread, Message, Question, Answer } = require('../models');
const { belongsToThread } = require('../utils/helpers');
const { signToken, AuthenticationError } = require('../utils/auth');
const bcrypt = require('bcrypt');
const { GraphQLError } = require('graphql');

require('dotenv').config({ path: '../.env'})
const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

const threadsIndex = process.env.NODE_ENV === 'production' ? client.initIndex('threadsIndex') : client.initIndex('dev_YAP_THREADS');
const usersIndex = process.env.NODE_ENV === 'production' ? client.initIndex('usersIndex') : client.initIndex('dev_YAP_USERS');

const resolvers = {
    Query: {
        users: async () => {
            try {
                const users = await User.find()
                    .populate('friends')
                    .populate('messageThreads')
                    .populate('answerChoices');

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
                return thread;
            } catch(err) {
                throw new Error(`Error getting one thread: ${err}`);
            }
        },
        mainPoll: async () => {
            try {
                const mainPoll = await Question.findOne({ isMainPoll: true }).populate({
                    path: 'answers',
                    populate: {
                        path: 'userId',
                        model: 'User'  // Only necessary if not automatically inferred
                    }
                });
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

                const algoliaUserData = {
                    objectID: newUser._id.toString(),
                    username: newUser.username
                };
                // for adding users to search index
                await usersIndex.saveObject(algoliaUserData)
                .catch(err => console.log('Failed to add user to algolia index', err))

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

                //updating users in algolia
                usersIndex.partialUpdateObject({
                    objectID: user._id, 
                    username: user.username,
                }).catch(err => {
                    console.error('Failed to update user in Algolia index', err);
                });
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

                // removing users from algolia search
                await usersIndex.deleteObject(user._id.toString())
                .catch(err => console.error('Failed to delete user from Algolia index', err))

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

                // adding thread to algolia search
                const algoliaThreadData = {
                    objectID: newThread._id.toString(),
                    name: newThread.name
                };

                await threadsIndex.saveObject(algoliaThreadData)
                .catch(err => console.log('Failed to add thread to algolia index', err))


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

                const questions = await Question.find({ messageThread: threadId });
                questions.forEach(async question => {
                    await Answer.deleteMany({ questionId: question._id });
                })
                
                await Question.deleteMany({ messageThread: threadId });
                await Message.deleteMany({ messageThread: threadId });
                await User.updateMany({ $pull: { messageThreads: threadId }});

                // removing thread from algolia search
                await threadsIndex.deleteObject(thread._id.toString())
                .catch(err => console.error('Failed to delete thread from Algolia index', err))

                const deletedThread = await MessageThread.findByIdAndDelete(threadId);

                return { message: 'success' }
            } catch(err) {
                throw new Error(`Error deleting thread: ${err}`);
            }
        },
        updateThread: async (parent, { threadId, name }, context) => {
            try {
                if (!context.user) {
                    throw AuthenticationError
                }
                const thread = await MessageThread.findById(threadId);

                const updatedThread = await MessageThread.findByIdAndUpdate(
                    threadId, 
                    { name: name }, 
                    { new: true })
                    .populate({ path: 'messages', populate: { path: 'sender', select: 'username' }})
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate('questions')
                    .populate({ path: 'questions', populate: 'creator' });
                // updating thread in algolia search
                threadsIndex.partialUpdateObject({
                    objectID: threadId, 
                    name: updatedThread.name,
                }).catch(err => {
                    console.error('Failed to update thread in Algolia index', err);
                });
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
                if (!belongsToThread(thread.participants, userId)) {
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

                return updatedMessage;
            } catch(err) {
                throw new Error(err);
            }
        },
        deleteMessage: async (parent, { messageId, userId }, context) => {
            try {
                if (!context.user) throw AuthenticationError
                // const userId = context.user._id

                const message = await Message.findById(messageId);

                await MessageThread.findByIdAndUpdate(message.messageThread, { $pull: { messages: messageId }}, { new: true });
                await Message.findByIdAndDelete(messageId);
  
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

                return {message: 'success' };
                
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

                return newQuestion.populate('creator')
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
                
                return updatedQuestion;
            } catch (err) {
                throw new Error(`Error answering question: ${err}`);
            }
        },
        adminUser: async (parent, { threadId, userId }, context) => {
            try {
                const thread = await MessageThread.findById(threadId);
                if(!context.user) {
                    throw AuthenticationError
                }

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
                if(!context.user) {
                    throw AuthenticationError
                }

                const updatedThread = await MessageThread.findByIdAndUpdate(threadId, { $pull: { admins: userId }}, { new: true })
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });

                return updatedThread
            } catch(err) {
                throw new Error(`Error removing admin: ${err}`);
            }
        }, 
        kickUser: async (parent, { userId, threadId }, context) => {
            try {
                if (!context.user) {
                    throw AuthenticationError
                }
                const updatedThread = await MessageThread.findByIdAndUpdate(
                    threadId, 
                    { $pull: { participants: userId, admins: userId }}, 
                    { new: true })
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });
                    await User.findByIdAndUpdate(userId, { $pull: { messageThreads: threadId }}, { new: true });
                    return updatedThread
            } catch(err) {
                throw new Error(`Erro kicking participant: ${err}`);
            }
        },
        addUserToThread: async (parent, { userId, threadId }, context) => {
            try {
                if (!context.user) {
                    throw AuthenticationError
                }

                const updatedThread = await MessageThread.findByIdAndUpdate(
                    threadId, 
                    { $addToSet: { participants: userId }}, 
                    { new: true })
                    .populate({ path: 'admins', select: 'username'})
                    .populate('participants')
                    .populate({ path: 'messages', populate: { path: 'sender' , select: 'username' }})
                    .populate({ path: 'questions', populate: 'creator' });

                await User.findByIdAndUpdate(userId, { $addToSet: { messageThreads: threadId }}, { new: true })

                return updatedThread
            } catch(err) {
                throw new Error(`Error adding user to thread: ${err}`)
            }
        }
    }
}

module.exports = resolvers;