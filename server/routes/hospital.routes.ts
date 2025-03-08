import express from 'express';
import { getAllHospitals } from '../controllers/hospital.controller';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

// Route to get all hospitals
router.get('/', catchAsync(getAllHospitals));

export default router;
