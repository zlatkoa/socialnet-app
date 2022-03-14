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
  likes: [{
    type: mongoose.Types.ObjectId,
    ref:'user'    
  }],
  bibleVerse: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('post', postSchema);