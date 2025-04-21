const  User  = require('../models/User');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({ fullname, email, password });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({
      token,
      message: "Successfully registered",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: 'Error registering user',
      error: err.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log(token);

    return res.status(200).json({
      token,
      message: "Successfully logged in",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: 'Error logging in',
      error: err.message,
    });
  }
};
