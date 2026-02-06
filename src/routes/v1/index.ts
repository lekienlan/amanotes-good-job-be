import express from 'express';
import authRoute from './auth.route';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth routes
router.use('/auth', authRoute);

export default router;
