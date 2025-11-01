const jwt = require('jsonwebtoken');
const { v5: uuidv5 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('@prisma/client');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
    });

    const payload = ticket.getPayload();
    const { sub: id, email, picture: profile_picture, given_name } = payload;
    const userId = uuidv5(id, uuidv5.DNS);

    // First, try to find by email (since email is unique)
    let existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      // Update the user ID if it doesn't match (in case of UUID generation changes)
      if (existingUser.id !== userId) {
        existingUser = await prisma.user.update({
          where: { email: email },
          data: { id: userId },
        });
      }
      const token = signToken(existingUser.id);
      return res.status(200).json({
        status: 'success',
        user: existingUser,
        token: token,
      });
    }

    // If no user by email, create new user
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        given_name,
        email,
        profile_picture,
      },
    });
    const newToken = signToken(newUser.id);
    return res.status(201).json({
      status: 'success',
      user: newUser,
      token: newToken,
    });
  } catch (error) {
    console.error('Error verifying Google token:', error.message);
    // Check if it's a unique constraint error
    if (error.code === 'P2002' && error.meta?.target === 'User_email_key') {
      // Try to find the user again and return it
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });
        if (existingUser) {
          const token = signToken(existingUser.id);
          return res.status(200).json({
            status: 'success',
            user: existingUser,
            token: token,
          });
        }
      } catch (findError) {
        console.error('Error finding existing user:', findError.message);
      }
    }
    return res.status(500).json({ message: 'Google authentication failed' });
  }
};
