const mongoose = require('mongoose');
const { format } = require('date-fns')

const messageThreadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    isGroupChat: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, get: (dateValue) => format(dateValue, 'PPPppp') }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    }
  }
);

const MessageThread = mongoose.model('MessageThread', messageThreadSchema);

module.exports = MessageThread;
