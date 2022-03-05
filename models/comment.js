const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true  
  },
  post: {
    ref: 'post',
    type: mongoose.Types.ObjectId
  },
  user: {
    ref: 'user',
    type: mongoose.Types.ObjectId
  }
}, { timestamps: true });

module.exports = mongoose.model('comment', commentSchema);