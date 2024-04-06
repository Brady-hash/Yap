const mongoose = require('mongoose');
const { format } = require('date-fns');

const questionSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageThread: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread', required: true },
  text: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },  
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  timestamp: { type: Date, default: Date.now, get: (dateValue) => format(dateValue, 'PPPppp') },
  createdAt: { type: Date, default: Date.now }
},
{
  toJSON: {
    virtuals: true,
    getters: true,
  }
}
);

questionSchema.virtual('answerCount').get(function() {
  return this.answers.length
})

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
