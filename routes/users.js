var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');

router.get('/', controller.getAllUsers)
      .get('/:id', controller.getIDUser)
      .post('/', controller.register)
      .post ('/login', controller.login)
      .patch('/friends/:id', controller.addFriend)
      .delete('/friends/:id', controller.deleteFriend)
      .patch('/:id', controller.patch)
      .delete('/:id', controller.delete)

module.exports = router;