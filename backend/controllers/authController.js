const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT token yaratma
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Qeydiyyat
exports.register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Email yoxla
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email artıq istifadə olunub' });
    }

    // Yeni istifadəçi yaratma
    user = await User.create({
      name,
      email,
      password,
      username
    });

    // Token yaratma
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Giriş
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email və şifrə lazımdır' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Yanlış email və ya şifrə' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Yanlış email və ya şifrə' });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Profil al
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends')
      .populate('followers')
      .populate('following');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
