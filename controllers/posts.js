const mongoose = require('mongoose');
const Post = require('../models/post');

module.exports ={
  getAllPosts:
  async (req, res) => {
    const posts = await Post.find();
    res.send({
      error: false,
      message: 'All posts from the database',
      posts: posts
    });
  },
  getIDPost:
  async (req, res) =>{
    const post = await Post.findById(req.params.id);
    res.send({
      error:false,
      message: `Comment with id #${post._id}`,
      post : post
    });
  },

  create:
  async (req, res) => {
    const post = await Post.create(req.body);
    res.send({
      error: false,
      message: 'New post has been created',
      post: post
    });
  },

  patch:
  async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    const post = await Post.findById(req.params.id);
    res.send({
      error: false,
      message: `Post with id #${post._id} has been updated`,
      post: post
    });
  },

  delete:
  async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.send({
      error: false,
      message: `Post with id #${req.params.id} has been deleted`
    });
  }
}