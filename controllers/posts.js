const mongoose = require('mongoose');
const Post = require('../models/post');
const axios = require('axios');
const response=require('../lib/response_handler');
const AccessControl = require ('accesscontrol');
const ac = new AccessControl();
const jwt = require ('jsonwebtoken');

//definiram roles za sekoj user i sto e dostapno na role da pravi vo ovoj kontroler so postovi
ac.grant('admin').createOwn('post'); //mu dozvoluvame na user da moze da kreira i da poseduva post
ac.deny('user').createOwn('post'); //ne mu dozvoluvame na admin da kreira post



module.exports ={
  getAllPosts:
  async (req, res) => {
    const posts = await Post.find().populate('user');
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
    const permission = ac.can(req.user.role).createOwn('post');//proveruvame dali roljata na user-ot koj sto pravi request ima dozvola da kreira post
    if(!permission.granted){//ako nema dozvola za kreiranje vraka 401 i prekinuva funkcijata, vo sprotivno prodolzuva dolu kodot
      response(res, 401, `Cannot create posts with role: ${req.user.role}`);
      return;
    }
  
    var config = {
      method: 'get',
      url: `${process.env.BIBLE_API_URL}/v1/bibles/06125adad2d5898a-01/chapters/GEN.2`,
      headers: { 
        'api-key': `${process.env.BIBLE_API_KEY}`
      }
    }

  const responseBible = await axios(config);
    req.body.bibleVerse=responseBible.data.data.content
    const post = await Post.create(req.body);
    res.send({
      error: false,
      message: 'New post has been created',
      post: post
    });
  },

  like:
  async (req, res) =>{
    const bearerToken = req.get("Authorization");
    const token = bearerToken.substring(7, bearerToken.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const activePost = await Post.findById(req.params.id);

    if (activePost){
      
      if(activePost.likes.includes(decoded.id)){
        return response (res, 400, "You allready liked this post");
      }else{    
        await Post.findByIdAndUpdate(req.params.id, {
          $push: { likes: decoded.id }
        });
        
        const likedPost = await Post.findById(req.params.id);
        var likes = likedPost.likes.length;
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