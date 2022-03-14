var express = require('express');
var router = express.Router();
const controller = require('../controllers/comments');
const jwt = require ('express-jwt');//modul za sporedba na jwt tokeni
const response = require('../lib/response_handler');


// ovde definirame avtorizacija, odnosno sporedba na tokenot
router.use(jwt({ 
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ['HS256'] 
}).unless({
      path: [
            {
                  url: '/comments/', methods: ['GET']//ovde definirame na koi ruti ne treba avtentikacija, odnosno da gi otvara bez da treba da se najavua korisnikot
            }
      ]
}));

router.use((err, req, res, next) => {
      console.log(err.name);
      if (err.name === 'UnauthorizedError') {
            response(res, 401, 'Unauthorized access');
      }
})


router.get('/', controller.getAllComments)
      .get('/:id', controller.getIDComment)
      .post('/', controller.create)
      .patch('/:id', controller.patch)
      .delete('/:id', controller.delete)
      .patch('/like/:id', controller.like)

module.exports = router;