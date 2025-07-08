import express from 'express';
import { forgotpasswordcode, logincode, registercode, resetpasswordcode } from '../controller/image-controller.js';
import { addproblem,getallproblems,getproblem,deleteproblem,modifyproblem } from '../controller/problem-controller.js';
import { verifytoken } from '../middleware/auth.js';
const router = express.Router();

router.post('/register', registercode);
router.post('/login', logincode);
router.post('/forgot-password',forgotpasswordcode);
router.post('/reset-password/:token',resetpasswordcode);

router.get('/problemset/:id',verifytoken,getproblem);
router.delete('/problemset/:id/delete',verifytoken,deleteproblem);
router.get('/problemset',verifytoken,getallproblems);

router.post('/problemset/add',verifytoken, addproblem);
router.patch('/problemset/:id/modify',verifytoken,modifyproblem);

export default router; // This exports the router so other files can import it otherwise files cannot access it.