const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const response = require('../lib/response_handler');
const jwt = require ('jsonwebtoken');

module.exports ={
  getAllUsers:
  async (req, res) => {
    const users = await User.find();
    res.send({
      error: false,
      message: 'All users from the database',
      users: users
    });
  },

  getIDUser:
  async (req, res) =>{
    const user = await User.findById(req.params.id);
    res.send({
      error:false,
      message: `Comment with id #${user._id}`,
      user : user
    });
  },

  create:
  async (req, res) => {
    const user = await User.create(req.body);
    res.send({
      error: false,
      message: 'New user has been created',
      user: user
    });
  },

  addFriend:
  async (req, res) =>{
    console.log(req.params.id);
    console.log(req.body.friend);
    await User.findByIdAndUpdate(req.params.id, {
      $push: { friends: req.body.friend }
    });
    await User.findByIdAndUpdate(req.body.friend, {
      $push: { friends: req.params.id }
    });
    const user1 = await User.findById(req.params.id);
    const user2 = await User.findById(req.body.friend);
    res.send({
      error:false,
      message: `Users with id #${user1._id} and #${user2._id} are now friends`,
      user1 : user1,
      user2 : user2
    });
  },

  deleteFriend:
  async (req, res) =>{
    console.log(req.params.id);
    console.log(req.body.friend);

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { friends: req.body.friend }
    });
    await User.findByIdAndUpdate(req.body.friend, {
      $pull: { friends: req.params.id }
    });
    const user1 = await User.findById(req.params.id);
    const user2 = await User.findById(req.body.friend);
    res.send({
      error:false,
      message: `Users with id #${user1._id} and #${user2._id} are not any more friends`,
      user1 : user1,
      user2 : user2
    });
  },
  

  patch:
  async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    const user = await User.findById(req.params.id);
    res.send({
      error: false,
      message: `User with id #${user._id} has been updated`,
      user: user
    });
  },

  delete:
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send({
      error: false,
      message: `User with id #${req.params.id} has been deleted`
    });
  },

  register:
  async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return response(res, 400, 'Bad request. User exists with the provided email.');
      }
  
      req.body.password = bcrypt.hashSync(req.body.password);
  
      user = await User.create(req.body);
  
      response(res, 201, 'New user has been created', { user })
    } catch (error) {
      return response(res, 500, error.msg);
    }
  },

  login:
  async (req, res) => {
    try {
      /**
       * Korisnikot probuva da se logira so email
       * 1. So emailot daden od koristnikot, barame vo baza dali ima takov korisnik koj e veke registriran
       * 2. Proveruvame so povik vo baza dali toj email veke posti - korisnikot e registriran
       *  2.a. Ako korisnikot potoi (emailot go ima vo baza), togas poredi go vneseniot pasvord so toj vo bazata
       *    2.a.1 Dokolku passwordite se isti, vrati JWT token
       *    2.a.2 Dokolku passwordite ne se isti, vrati response za invalid credentials (ne nanaznacuvaj email ili password - credentials e ok)
       *  2.b. Dokolku korisnikot ne postoi (emailot go nema vo baza), vrati response za invalid credentials
       */
      const user = await User.findOne({ email: req.body.email }); //pravime povik vo baza i barame dali emailot vo body go ima vo baza
      if (user) {// ako emailot go ima ovde ke vrati true i prodolzuva vo sledniot red da go sporedi passwordot
        if (bcrypt.compareSync(req.body.password, user.password)) {//ovde proveruva dali passwordot vnesen vo body e isto so toj vo baza (so bcrypt.compareSync vrsi enkripcija na passot od body i proveruva dali e istiot hash so toj vo baza)
          // ako se sovpadnat passwordite treba da vrati token
          //token = plain data (JSON payload) + secret key za potpisuvanje na token + config options
          // tokenot se sostoi od = payload + kluch za enkripcija + config opcii (najcesto kolku vreme ke trae tokenot)
          const payload = { //tuka go spremame payload vo JSON format
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            role: user.role
          }
  
          const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {//tuka go generirame tokenot so parametrite
            expiresIn: '50m'
          });
  
          response(res, 200, 'You have logged in successfully', { token })
        } else {
          response(res, 401, 'Invalid credentials');
        }
      } else {
        response(res, 401, 'Invalid credentials');
      }
    } catch (error) {
      response(res, 500, error.msg);
    }
  }
}