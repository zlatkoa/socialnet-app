var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');


router.get('/', controller.getAllUsers)
      .get('/:id', controller.getIDUser)
      .post('/', controller.register)
      .patch('/:id', controller.patch)
      .delete('/:id', controller.delete)

module.exports = router;