const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, given_name } = profile;
        console.log(profile);

        let user = await prisma.user.findUnique({
          where: { email: emails[0].value },
        });

        if (user) {
          return done(null, user);
        }

        user = await prisma.user.create({
          data: {
            email: emails[0].value,
            given_name: given_name,
            profile_picture: profile.photos ? profile.photos[0].value : null,
          },
        });

        return done(null, user);
      } catch (err) {
        console.error('Error during authentication:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null);
  }
});

module.exports = passport;
