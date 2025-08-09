import express from 'express';
import { uploadResume, getQuestions, submitAnswers, upload } from '../controllers/interviewControllers.js';

const router = express.Router();

router.post('/uploadResume', upload.single('resume'), uploadResume);
router.post('/getQuestions', getQuestions);
router.post('/submitAnswers', submitAnswers);

export default router;
