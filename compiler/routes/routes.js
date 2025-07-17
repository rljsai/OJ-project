import express from 'express';
import { verifytoken } from '../middleware/auth.js';
import {customtestcode } from '../controller/custom-image.js';
import { runcode } from '../controller/run-image.js';
import { submitcode } from '../controller/submit-image.js';
import { getallsubmissions,getsubmissionbyid } from '../controller/submissions-image.js';
import { aiFeedback } from '../controller/AIfeedback-image.js';
const router = express.Router();



router.post('/customtest',verifytoken,customtestcode);
router.post('/runcode',verifytoken,runcode);
router.post('/submitcode',verifytoken,submitcode);
router.get('/getallsubmissions',verifytoken,getallsubmissions);
router.get('/getsubmissionbyid',verifytoken,getsubmissionbyid);
router.post('/ai-feedback',verifytoken,aiFeedback);
export default router;