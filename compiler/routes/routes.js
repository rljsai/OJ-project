import express from 'express';
import { verifytoken } from '../middleware/auth.js';
import {customtestcode } from '../controller/custom-image.js';
import { runcode } from '../controller/run-image.js';
const router = express.Router();



router.post('/customtest',customtestcode);
router.post('/runcode',runcode);
export default router;