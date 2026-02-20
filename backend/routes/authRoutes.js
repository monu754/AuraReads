import express from 'express';
import { register, login } from '../controllers/authController.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Existing Manual Routes
router.post('/register', register);
router.post('/login', login);

// --- NEW OAUTH ROUTES ---

// Helper function to generate token and redirect back to Vercel
const handleOAuthRedirect = (req, res) => {
  // Generate the JWT Badge
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Package the user data
  const userData = JSON.stringify({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });

  // Send them back to the frontend with the keys hidden in the URL!
  res.redirect(`https://aurareads.vercel.app/login?token=${token}&user=${encodeURIComponent(userData)}`);
};

// Google Login Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'https://aurareads.vercel.app/login' }), handleOAuthRedirect);

// GitHub Login Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: 'https://aurareads.vercel.app/login' }), handleOAuthRedirect);

export default router;