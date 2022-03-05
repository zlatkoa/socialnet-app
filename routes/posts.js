var express = require('express');
var router = express.Router();
const controller = require('../controllers/posts');


router.get('/', controller.getAllPosts)
      .get('/:id', controller.getIDPost)
      .post('/', controller.create)
      .patch('/:id', controller.patch)
      .delete('/:id', controller.delete)

module.exports = router;