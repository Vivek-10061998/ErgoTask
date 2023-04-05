const express = require('express');
const {createUser,getUsers,getUserById,updateUser,deleteUser} = require('../controller/userController.js');

const router = express.Router();

// Create new user
router.post('/create', createUser);

// Get all users
router.get('/get', getUsers);

// Get user by id
router.get('/get/:id', getUserById);

// Update user by id
router.put('/update/:id', updateUser);

// Delete user by id
router.delete('/delete/:id', deleteUser);

module.exports = router;
