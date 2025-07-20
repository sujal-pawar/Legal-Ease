const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const requiredProfileFields = {
  judge: ['courtId', 'jurisdiction'],
  lawyer: ['barNumber', 'specialization', 'yearsOfExperience'],
  litigant: [],
  admin: []
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role, profile = {} } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Role-specific profile validation
    const missing = (requiredProfileFields[role] || []).filter(
      (field) => !profile[field] || (Array.isArray(profile[field]) && profile[field].length === 0)
    );
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required profile fields: ${missing.join(', ')}` });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const user = new User({
      fullName,
      email,
      password,
      role,
      profile: profile || {}
    });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}; 