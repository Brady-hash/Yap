const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  messagesThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread' }],
  answerChoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
