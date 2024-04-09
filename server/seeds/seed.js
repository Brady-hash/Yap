const db = require('../config/connection');
const mongoose = require('mongoose');
const { User, MessageThread, Message, Question, Answer } = require('../models');
const cleanAll = require('./cleanDb');

const userData = require('./userData.json');

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

db.once('open', async () => {
    try {

        await cleanAll();

        const users = await User.create(userData);
        let userIds = users.map(user => user._id);

        let messageThreads = [];
        for (const user of users) {
            // removes admin from list of possible other participants
            userIds = userIds.filter(id => !id.equals(user._id));
            const shuffledUserIds = shuffleArray([...userIds]);
            const participantIds = shuffledUserIds.slice(0, Math.floor(Math.random() * shuffledUserIds.length));
            const thread = await MessageThread.create({
                name: `${user.username}'s Thread`,
                admins: [user._id],
                participants: [user._id, ...participantIds],
                creator: user._id
            });
            messageThreads.push(thread);
            await User.findByIdAndUpdate(user._id, { $addToSet: { messageThreads: thread._id } }, { new: true });
        }

        for (const thread of messageThreads) {
            const message = await Message.create({
                messageThread: thread._id,
                sender: thread.creator,
                text: `${thread.name}'s first message! Welcome!`,
            });
            await MessageThread.findByIdAndUpdate(thread._id, { $push: { messages: message._id } })
        }

        for (const thread of messageThreads) {
            for (const userId of thread.participants) {
                const user = await User.findById(userId);
                const message = await Message.create({
                    messageThread: thread._id,
                    sender: userId,
                    text: `Message from ${user.username} in ${thread.name}`,
                });
                await MessageThread.findByIdAndUpdate(thread._id, { $push: { messages: message._id} } )
            }
            for (const participantId of thread.participants) {
                await User.findByIdAndUpdate(participantId, { $addToSet: { messageThreads: thread._id } });
            }
        }
        

        console.log('success')
        process.exit(0)
    } catch(err) {
        console.log(`Error seeding database: ${err}`);
        process.exit(1)
    }
})