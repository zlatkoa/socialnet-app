const mongoose = require('mongoose');
const Comment = require('../models/comment');
const bcrypt = require('bcryptjs');
const response = require('../lib/response_handler');
const jwt = require ('jsonwebtoken');

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
    const bearerToken = req.get("Authorization");
    const token = bearerToken.substring(7, bearerToken.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.user = decoded.id;
    const comment = await Comment.create(req.body);
    
    res.send({
      error: false,
      message: 'New comment has been created',
      comment: comment
    });
  },

  like:
  async (req, res) =>{
    const bearerToken = req.get("Authorization");
    const token = bearerToken.substring(7, bearerToken.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const activeComment = await Comment.findById(req.params.id);

    if (activeComment){
      
      if(activeComment.likes.includes(decoded.id)){
        return response (res, 400, "You allready liked this comment");
      }else{    
        await Comment.findByIdAndUpdate(req.params.id, {
          $push: { likes: decoded.id }
        });
        
        const likedComment = await Comment.findById(req.params.id);
        var likes = likedComment.likes.length;
        res.send({
          error:false,
          message: `You liked post #${req.params.id}. The post have ${likes} likes`,
        });
      }
    }else{
      return response (res, 400, "Requested post does not exist in the database");
    }
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