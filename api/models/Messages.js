const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const messageSchema = new Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  resiver: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  message: String,
  messageDate: Date,
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;