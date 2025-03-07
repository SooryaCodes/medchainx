import express from 'express';
import { registerPatient, getPatientById, generateHealthRiskAnalysis } from '../controllers/patient.controller';

const router = express.Router();

router.post('/register', registerPatient);
router.get('/:id', getPatientById);
router.get('/:id/health-risks', generateHealthRiskAnalysis);

export default router;