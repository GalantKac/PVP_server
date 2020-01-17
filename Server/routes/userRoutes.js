const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/login')
    .post(userController.loginUser);

router
    .route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router
    .route('/:id/stats')
    .put(userController.changeUserStats);

module.exports = router;