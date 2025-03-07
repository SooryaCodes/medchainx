import express from 'express';
import { registerPatient } from '../controllers/patient.controller';

const router = express.Router();

router.post('/register', registerPatient);

export default router;