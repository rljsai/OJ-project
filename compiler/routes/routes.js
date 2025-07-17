import express from 'express';
import { verifytoken } from '../middleware/auth.js';
import {customtestcode } from '../controller/compiler-image.js';
const router = express.Router();



router.post('/customtest',customtestcode);

export default router;