const User = require('../model/user.js');

// Create new user
async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message : 'User Inserted Successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all users
async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get user by id
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update user by id
async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User updated Successfully'});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete user by id
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User Deleted Successfully'});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
