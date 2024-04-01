const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },  
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
