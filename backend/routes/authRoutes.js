import express from 'express';
import { register, login, getAllUsers, updateUserRole } from '../controllers/authController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Existing Manual Routes
router.post('/register', register);
router.post('/login', login);

// --- NEW ADMIN ROUTES ---
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.put('/users/:id/role', verifyToken, isAdmin, updateUserRole);

// --- EXISTING OAUTH ROUTES ---
const handleOAuthRedirect = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const userData = JSON.stringify({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });

  res.redirect(`https://aurareads.vercel.app/login?token=${token}&user=${encodeURIComponent(userData)}`);
};

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'https://aurareads.vercel.app/login' }), handleOAuthRedirect);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: 'https://aurareads.vercel.app/login' }), handleOAuthRedirect);

export default router;