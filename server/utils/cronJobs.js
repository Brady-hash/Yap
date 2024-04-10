const cron = require('node-cron');
const  Question  = require('../models/Question');

const questionList = [
  {
    text: 'What is your favorite color?',
    option1: 'Red',
    option2: 'Blue',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
  {
    text: 'Which programming language do you prefer?',
    option1: 'JavaScript',
    option2: 'Python',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
  {
    text: 'Which programming language do you hate?',
    option1: 'JavaScript',
    option2: 'Python',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
  {
    text: 'Which programming language do you not like?',
    option1: 'JavaScript',
    option2: 'Python',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
  {
    text: 'Which programming language do you prefer?',
    option1: 'Script',
    option2: 'Pytsssshon',
    option1Count: 0,
    option2Count: 0,
    isMainPoll: true,
  },
];

let currentQuestionIndex = 0;

const scheduleMainPollSwitch = () => {
  cron.schedule('* * * * *', async () => {
    try {
      // Find and delete the existing main poll
      await Question.findOneAndDelete({ isMainPoll: true });

      // Get the current question from the list
      const currentQuestion = questionList[currentQuestionIndex];

      // Create and insert the new main poll
      const newQuestion = await createMainPoll(currentQuestion);

      console.log('Main poll scheduled successfully:', newQuestion);

      // Increment the index to switch to the next question
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
    throw error; // Throw the error for handling in the calling function
  }
}

module.exports = {
  scheduleMainPollSwitch,
};
