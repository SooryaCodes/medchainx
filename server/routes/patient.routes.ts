import express from 'express';
import { 
  registerPatient, 
  getPatientById, 
  generateHealthRiskAnalysis,
  generatePatientAccessToken,
  verifyPatientToken,
  decodePatientAccessToken,
  revokePatientToken
} from '../controllers/patient.controller';

const router = express.Router();

// Patient registration and data retrieval
router.post('/register', registerPatient);
router.get('/:id', getPatientById);
router.get('/:id/health-risks', generateHealthRiskAnalysis);

// Token management routes
router.post('/generate-token', generatePatientAccessToken); // POST route to send patientId and expiresIn
router.post('/verify-token', verifyPatientToken);          // Verify token validity
router.post('/decode-token', decodePatientAccessToken);    // Decode token without verification
router.post('/revoke-token', revokePatientToken);          // Revoke a patient token

export default router;