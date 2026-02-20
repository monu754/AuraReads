import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to process Google/GitHub users into your database
const processOAuthUser = async (profile, done) => {
  try {
    // GitHub sometimes hides the email, so we create a fallback
    const email = profile.emails?.[0]?.value || `${profile.id}@github.com`;
    const name = profile.displayName || profile.username || 'User';

    // Check if user already exists
    let user = await User.findOne({ email });
    
    // If they are new, create an account for them automatically!
    if (!user) {
      // Create a random dummy password since they use OAuth
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'User' // Default to normal user
      });
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

// 1. Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://aurareads-backend.onrender.com/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => processOAuthUser(profile, done)));

// 2. GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://aurareads-backend.onrender.com/api/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => processOAuthUser(profile, done)));

export default passport;