const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [{
    type: mongoose.Types.ObjectId,
    ref:'user'    
  }]

}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);