const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const response = require('../lib/response_handler');
const jwt = require ('jsonwebtoken');
const Friendship = require('../models/friendship');

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
  async (req, res) => {
    console.log(req.user);
    try {
      const userTwo = await User.findById(req.params.id);
  
      if (!userTwo) {
        response(res, 404, 'Cannot add to friends a user that doesn\'t exist.');
        return;
      }
  
      const friendship = await Friendship.create({
        user_one: req.user.id,
        user_two: userTwo._id
      })
  
      response(res, 201, `User with id #${req.user.id} has added to friends user with id #${req.params.id}.`, { friendship })
    } catch (error) {
      response(res, 500, error.message, { error })
    }
  },

  getAllFriendships:
  async (req, res) => {
    const friendships = await Friendship.find();
    res.send({
      error: false,
      message: 'All friendships from the database',
      friendships: friendships
    });
  },





  db.friendships.find({ $or: 
    [
      { $and: [{ user_one: ObjectId("622903a8fc92d962ba45227c") }, { user_two: ObjectId("62323dbb246d0671f281b955") }] }, 
      { $and: [{ user_one: ObjectId("62323dbb246d0671f281b955") }, { user_two: ObjectId("622903a8fc92d962ba45227c") }] }
    ] 
  })


  //   async (req, res) =>{
  //   const bearerToken = req.get("Authorization");
  //   const token = bearerToken.substring(7, bearerToken.length);
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //   const activeUser = await User.findById(decoded.id);
  //   const requestedFriend = await User.findById(req.body.friend);

  //   if(requestedFriend){
  //     if (activeUser.friends.includes(req.body.friend)){
  //       return response(res, 400, "The user is allready your friend");
  //     }else{
  //       await User.findByIdAndUpdate(decoded.id, {
  //         $push: { friends: req.body.friend }
  //       });
  //       await User.findByIdAndUpdate(req.body.friend, {
  //         $push: { friends: decoded.id }
  //       });
  //       const user1 = await User.findById(decoded.id);
  //       const user2 = await User.findById(req.body.friend);
  //       res.send({
  //         error:false,
  //         message: `Users with id #${user1.id} and #${user2.id} are now friends`,
  //         user1 : user1,
  //         user2 : user2
  //       });
  //     }
  // }else{
  //   return response(res, 400, 'Bad request. User does not exist in the DB.');
  //   }
  // },

  deleteFriend:
  async (req, res) =>{
    const bearerToken = req.get("Authorization");
    const token = bearerToken.substring(7, bearerToken.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const activeUser = await User.findById(decoded.id);
    const exFriend = await User.findById(req.body.friend);

    if(exFriend){
      if (activeUser.friends.includes(req.body.friend)){    
        await User.findByIdAndUpdate(decoded.id, {
          $pull: { friends: req.body.friend }
        });
        await User.findByIdAndUpdate(req.body.friend, {
          $pull: { friends: decoded.id }
        });
        const user1 = await User.findById(decoded.id);
        const user2 = await User.findById(req.body.friend);
        res.send({
          error:false,
          message: `Users with id #${user1.id} and #${user2.id} are not any more friends`,
          user1 : user1,
          user2 : user2
        });
      }else{
        return response(res, 400, "There is not such user in your freind list");
      }
    }else{
      return response (res, 400, 'The user is not your friend, you can not remove him from your friendlist');
    }
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
        if (bcrypt.compareSync(req.body.password, user.password)) {
          //ovde proveruva dali passwordot vnesen vo body e isto so toj vo baza (so bcrypt.compareSync vrsi enkripcija na passot od body i proveruva dali e istiot hash so toj vo baza)
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