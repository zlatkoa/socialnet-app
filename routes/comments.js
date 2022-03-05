var express = require('express');
var router = express.Router();
const controller = require('../controllers/comments');


router.get('/', controller.getAllComments)
      .get('/:id', controller.getIDComment)
      .post('/', controller.create)
      .patch('/:id', controller.patch)
      .delete('/:id', controller.delete)

module.exports = router;