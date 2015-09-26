'use strict';

var express = require('express');
var controller = require('./maid.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.search_maid);
router.post('/comp_maid',controller.compare_maid);
router.get('/:id', controller.getMaidById);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);


module.exports = router;