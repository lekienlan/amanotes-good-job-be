import express from 'express';
import authRoute from './auth.route';
import kudoRoute from './kudo.route';
import userRoute from './user.route';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth routes
router.use('/auth', authRoute);

// Kudo routes
router.use('/kudos', kudoRoute);

// User routes
router.use('/users', userRoute);

export default router;
