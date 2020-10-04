const express = require('express');
const multer = require('multer');
const verifyJwt = require('../middlewares/verifyJwt');
const uploadConfig = require('../config/upload');

const UserController = require('../controllers/UserController');

const userRoutes = express.Router();
const upload = multer(uploadConfig('user'));

userRoutes.get('/:id', verifyJwt, UserController.show);
userRoutes.put('/', verifyJwt, upload.single('avatar'), UserController.update);
userRoutes.post('/signup', UserController.store);

module.exports = userRoutes;
