'use strict';

var express = require('express');

var controller = require('./maid.controller');

var router = express.Router();

router.post('/allmaids', controller.index);
router.post('/', controller.create);
router.get('/:id', controller.show);
//router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/uploadimage', controller.uploadImage);


router.get('/front', controller.index);
router.post('/front/', controller.create);
router.get('/front/:id', controller.show);
//router.post('/', controller.create);
router.put('/front/:id', controller.update);
router.patch('/front/:id', controller.update);
router.delete('/front/:id', controller.destroy);

module.exports = router;
