import express from 'express';
import {
  registerPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  addDoctorToPatient,
//   removeDoctorFromPatient,
//   getPatientMedicalReports,
//   getPatientDoctors,
//   exportPatientFHIR
} from '../controllers/patient.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerPatient);

// Protected routes
router.get('/', protect, authorize('admin', 'doctor', 'hospital'), getPatients);
router.get('/:id', protect, authorize('admin', 'doctor', 'hospital', 'patient'), getPatient);
router.put('/:id', protect, authorize('admin', 'hospital', 'patient'), updatePatient);
router.delete('/:id', protect, authorize('admin', 'hospital'), deletePatient);

// Doctor assignment routes
router.post('/:id/doctors', protect, authorize('admin', 'doctor', 'hospital'), addDoctorToPatient);
router.delete('/:id/doctors/:doctorId', protect, authorize('admin', 'doctor', 'hospital'), removeDoctorFromPatient);

// Medical reports routes
router.get('/:id/medical-reports', protect, authorize('admin', 'doctor', 'hospital', 'patient'), getPatientMedicalReports);

// Get patient's doctors
router.get('/:id/doctors', protect, authorize('admin', 'doctor', 'hospital', 'patient'), getPatientDoctors);

// Export FHIR representation
router.get('/:id/fhir', protect, authorize('admin', 'doctor', 'hospital', 'patient'), exportPatientFHIR);

export default router; 