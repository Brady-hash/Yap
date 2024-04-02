const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  messagesThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread' }],
  answerChoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
