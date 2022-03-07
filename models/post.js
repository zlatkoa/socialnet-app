const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true  
  },
  user: {
    ref: 'user',
    type: mongoose.Types.ObjectId
  },
  bibleVerse: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('post', postSchema);