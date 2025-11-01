const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;
  try {
    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ message: 'Password and password confirm do not match' });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        given_name: username,
        email,
        password: hashedPassword,
      },
    });
    const token = signToken(newUser.id);
    return res.status(201).json({
      status: 'success',
      token,
      message: 'User created successfully',
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: 'Please log in by Google account' });
    }
    const token = signToken(user.id);

    return res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          username: user.given_name,
          email: user.email,
          picture: user.profile_picture,
          created_at: user.created_at,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.given_name,
          email: user.email,
          profile_picture: user.profile_picture,
          created_at: user.created_at,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { given_name, email, profile_picture } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        given_name: given_name || undefined,
        email: email || undefined,
        profile_picture: profile_picture || undefined,
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updatedUser.id,
          username: updatedUser.given_name,
          email: updatedUser.email,
          profile_picture: updatedUser.profile_picture,
          created_at: updatedUser.created_at,
        },
      },
    });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ message: 'Server error during user update' });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'You are not logged in! Please log in to get access',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const freshUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!freshUser) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    if (freshUser.password_changed_at) {
      const passwordChangedAt = freshUser.password_changed_at;
      if (
        passwordChangedAt &&
        passwordChangedAt > new Date(decoded.iat * 1000)
      ) {
        return res.status(401).json({
          message: 'User recently changed password! Please log in again',
        });
      }
    }

    req.user = freshUser;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Server error during token verification' });
  }
};
