const mongoose = require('mongoose');
const { format } = require('date-fns');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageThread: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread', required: true },
  timestamp: { type: Date, default: Date.now, get: (dateValue) => format(dateValue, 'PPPppp') }
},
{
  toJSON: {
    virtuals: true,
    getters: true,
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
