import express from 'express';
import { forgotpasswordcode, logincode, registercode, resetpasswordcode } from '../controller/image-controller.js';
const router = express.Router();

router.post('/register', registercode);
router.post('/login', logincode);
router.post('/forgot-password',forgotpasswordcode);
router.post('/reset-password',resetpasswordcode);

export default router; // This exports the router so other files can import it otherwise files cannot access it.