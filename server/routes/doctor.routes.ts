import express from 'express';
import { registerDoctor, getAllDoctors, getDoctorById } from '../controllers/doctor.controller';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

// Route to register a new doctor
router.post('/register', registerDoctor);

// Route to get all doctors
router.get('/', catchAsync(getAllDoctors));

// Route to get a specific doctor by ID
router.get('/:id', catchAsync(getDoctorById));

export default router; 