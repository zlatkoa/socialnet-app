const mongoose = require('mongoose');
const Comment = require('../models/comment');

module.exports ={
  getAllComments:
  async (req, res) => {
    const comments = await Comment.find().populate('user post');
    res.send({
      error: false,
      message: 'All comments from the database',
      comments: comments
    });
  },

  getIDComment:
  async (req, res) =>{
    const comment = await Comment.findById(req.params.id).populate('user', 'post');
    res.send({
      error:false,
      message: `Comment with id #${comment._id}`,
      comment : comment
    });
  },

  create:
  async (req, res) => {
    const comment = await Comment.create(req.body);
    res.send({
      error: false,
      message: 'New comment has been created',
      comment: comment
    });
  },

  patch:
  async (req, res) => {
    await Comment.findByIdAndUpdate(req.params.id, req.body);
    const comment = await Comment.findById(req.params.id);
    res.send({
      error: false,
      message: `Comment with id #${comment._id} has been updated`,
      comment: comment
    });
  },

  delete:
  async (req, res) => {
    await Comment.findByIdAndDelete(req.params.id);
    res.send({
      error: false,
      message: `Comment with id #${req.params.id} has been deleted`
    });
  }
}