const cron = require('node-cron');
const  Question  = require('../models/Question');

const questionList = [
  {
    text: 'Which do you prefer: front-end development or back-end development?',
    option1: 'Front-End',
    option2: 'Back-End',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
  {
  text: 'In a world where only one breakfast can be saved, which would you choose: waffles or pancakes?',
  option1: 'Waffles',
  option2: 'Pancakes',
  option1Count: 0,
  option2Count: 0,
  isMainPoll: true,
  },
  {
    text: 'Which color do you prefer: red or blue?',
    option1: 'Red',
    option2: 'Blue',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
  {
    text: 'Do you like pineapples on pizza?',
    option1: 'Yes',
    option2: 'No',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
  {
    text: 'Which do you prefer: MongoDB or mysql?',
    option1: 'MongoDB',
    option2: 'MySQL',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  }
];

let currentQuestionIndex = 0;

const scheduleMainPollSwitch = () => {
  cron.schedule('*/2 * * * *', async () => {
    try {
      // Find and delete the existing main poll
      await Question.findOneAndDelete({ isMainPoll: true });

      // Get the current question from the list
      const currentQuestion = questionList[currentQuestionIndex];

      // Create and insert the new main poll
      const newQuestion = await createMainPoll(currentQuestion);

      console.log('Main poll scheduled successfully:', newQuestion);

      // Increment the index
      currentQuestionIndex = (currentQuestionIndex + 1) % questionList.length;
    } catch (error) {
      console.error('Error scheduling main poll:', error);
    }
  });
};

async function createMainPoll(questionData) {
  try {
    const newQuestion = new Question({
      ...questionData,
    });

    await newQuestion.save(); // Save the new question to the database

    return newQuestion; // Return the newly created question
  } catch (error) {
    console.error('Error creating main poll:', error);
    throw error;
  }
}

module.exports = {
  scheduleMainPollSwitch,
};
