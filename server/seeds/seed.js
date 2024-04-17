const db = require('../config/connection');
const mongoose = require('mongoose');
const { User, MessageThread, Message, Question, Answer } = require('../models');
const cleanAll = require('./cleanDb');

const userData = require('./userData.json');
const questionData = require('./questionData.json');

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

        const mainQuestion = await Question.create({
            text: questionData.text,
            option1: questionData.option1,
            option2: questionData.option2,
            option1Count: questionData.option1Count,
            option2Count: questionData.option2Count,
            isMainPoll: questionData.isMainPoll
        });

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