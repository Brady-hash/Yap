const mongoose = require('mongoose');
const { format } = require('date-fns')

const messageThreadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
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
