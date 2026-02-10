/**
 * Core values routes - list core values
 */

import express from 'express';
import { getCoreValuesHandler } from '../../modules/core_value/core_values.controller';

const router = express.Router();

/**
 * @route   GET /core-values
 * @desc    List all core values (no pagination)
 * @access  Public
 */
router.get('/', getCoreValuesHandler);

export default router;
