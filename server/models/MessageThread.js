const mongoose = require('mongoose');

const messageThreadSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  isGroupChat: { type: Boolean, default: false }, // Indicates whether the thread is a group chat

});

const MessageThread = mongoose.model('MessageThread', messageThreadSchema);

module.exports = MessageThread;
