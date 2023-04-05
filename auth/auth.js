const bcrypt = require('bcryptjs');
const { createToken } = require('./jwt.js');
const User = require('../model/user.js');

async function register(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ name: req.body.name, email: req.body.email, password: hashedPassword });
    const savedUser = await user.save();
    res.status(200).json({message : 'User Registered Successfully !!!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = createToken({ userId: user._id });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {register,login};
