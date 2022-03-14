var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');
const jwt = require ('express-jwt');//modul za sporedba na jwt tokeni
const response = require('../lib/response_handler');



// ovde definirame avtorizacija, odnosno sporedba na tokenot
router.use(jwt({ 
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ['HS256'] 
}).unless({
      path: [
            {
                  url: '/users', methods: ['POST']//ovde definirame na koi ruti ne treba avtentikacija, odnosno da gi otvara bez da treba da se najavua korisnikot
            },
            {
                  url: '/users/login', methods: ['POST']
            }
      ]
}));

router.use((err, req, res, next) => {
      console.log(err.name);
      if (err.name === 'UnauthorizedError') {
            response(res, 401, 'Unauthorized access');
      }
})

router.get('/', controller.getAllUsers)
      .get('/:id', controller.getIDUser)
      .post('/', controller.register)
      .post ('/login', controller.login)
      .patch('/friends/', controller.addFriend)
      .delete('/friends/', controller.deleteFriend)
      .patch('/:id', controller.patch)
      .delete('/:id', controller.delete)

module.exports = router;