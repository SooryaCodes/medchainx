import express from 'express';
import { registerPatient, getPatientById } from '../controllers/patient.controller';

const router = express.Router();

router.post('/register', registerPatient);
router.get('/:id', getPatientById);

export default router;