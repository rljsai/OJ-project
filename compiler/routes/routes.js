import express from 'express';
import { verifytoken } from '../middleware/auth.js';
import { runcode } from '../controller/compiler-image.js';
const router = express.Router();


router.post('/run',runcode);

export default router;