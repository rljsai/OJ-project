import express from 'express';
import { logincode, registercode } from '../controller/image-controller.js';
const router = express.Router();

router.post('/register', registercode);
router.post('/login', logincode);


export default router; // This exports the router so other files can import it otherwise files cannot access it.