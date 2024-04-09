const mongoose = require('mongoose');
const { format } = require('date-fns');

const questionSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  messageThread: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread'},
  text: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option1Count: { type: Number, required: true, default: 0 },
  option2Count: { type: Number, required: true, default: 0 },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  timestamp: { type: Date, default: Date.now, get: (dateValue) => format(dateValue, 'PPPppp') },
  createdAt: { type: Date, default: Date.now },
  isMainPoll: { type: Boolean, default: false }
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
});

questionSchema.virtual('option1Percentage').get(function() {
  const totalAnswers = this.option1Count + this.option2Count;
  return totalAnswers > 0 ? (this.option1Count / totalAnswers) * 100 : 0; 
})

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
