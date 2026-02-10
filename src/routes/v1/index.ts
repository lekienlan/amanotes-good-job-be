import express from 'express';
import authRoute from './auth.route';
import kudoRoute from './kudo.route';
import userRoute from './user.route';
import coreValuesRoute from './core_value.route';
import rewardRoute from './reward.route';
import redemptionRoute from './redemption.route';

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

// Core values routes
router.use('/core-values', coreValuesRoute);

// Reward routes
router.use('/rewards', rewardRoute);

// Redemption routes
router.use('/redemptions', redemptionRoute);

export default router;
