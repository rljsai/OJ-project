import express from 'express';
import { verifytoken } from '../middleware/auth.js';
import {customtestcode } from '../controller/custom-image.js';
import { runcode } from '../controller/run-image.js';
import { submitcode } from '../controller/submit-image.js';
const router = express.Router();



router.post('/customtest',verifytoken,customtestcode);
router.post('/runcode',verifytoken,runcode);
router.post('/submitcode',verifytoken,submitcode);
export default router;