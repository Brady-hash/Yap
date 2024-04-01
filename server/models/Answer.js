const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answerChoice: { type: Boolean, required: true }});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
