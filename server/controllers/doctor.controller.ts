import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { DoctorModel, IDoctor } from '../models';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Interface for doctor registration data from frontend
interface DoctorRegistrationData {
  // Authentication Info
  username: string;
  password: string;
  
  // Personal Info
  given_name: string;
  family_name: string;
  email: string;
  phone: string;
  
  // Professional Info
  specialty: string;
  years_of_experience: string;
  license_number: string;
  consultation_fee: string;
  telemedicine_available: boolean;
  
  // Hospital Affiliation
  hospital_id: string;
  
  // Languages
  languages_spoken: string[];
  
  // Schedule
  available_timings: Array<{
    day: string;
    startTime: string;
    endTime: string;
    enabled: boolean;
  }>;
}

// @desc    Register a new doctor
// @route   POST /api/doctors/register
// @access  Public
export const registerDoctor = catchAsync(async (
  req: Request<{}, {}, DoctorRegistrationData>,
  res: Response
) => {
  const doctorData = req.body;

  // 1. Validate if user already exists
  const existingDoctor = await DoctorModel.findOne({ 'contact.email': doctorData.email });
  if (existingDoctor) {
    return res.status(400).json({
      success: false,
      error: 'Doctor with this email already exists'
    });
  }

  try {
    // Format available timings to match schema
    const formattedTimings = doctorData.available_timings
      .filter(timing => timing.enabled)
      .map(timing => ({
        day: timing.day,
        startTime: timing.startTime,
        endTime: timing.endTime
      }));

    // Create MongoDB Doctor document
    const doctor = await DoctorModel.create({
      resourceType: "Practitioner",
      id: `dr_${new mongoose.Types.ObjectId().toString()}`,
      name: {
        given: [doctorData.given_name],
        family: doctorData.family_name
      },
      specialty: doctorData.specialty,
      hospitalId: new mongoose.Types.ObjectId(doctorData.hospital_id),
      yearsOfExperience: parseInt(doctorData.years_of_experience),
      availableTimings: formattedTimings,
      contact: {
        phone: doctorData.phone,
        email: doctorData.email
      },
      consultationFee: parseInt(doctorData.consultation_fee),
      telemedicineAvailable: doctorData.telemedicine_available,
      languagesSpoken: doctorData.languages_spoken,
      // Store credentials separately
      credentials: {
        username: doctorData.username,
        password: bcrypt.hashSync(doctorData.password, 10),
        licenseNumber: doctorData.license_number
      }
    });

    // Send response
    res.status(201).json({
      success: true,
      data: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty
      },
      message: 'Doctor registered successfully'
    });
  } catch (error) {
    console.error('Error registering doctor:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while registering doctor'
    });
  }
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  try {
    const doctors = await DoctorModel.find({})
      .select('id name specialty hospitalId consultationFee telemedicineAvailable')
      .populate('hospitalId', 'name');
    
    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors'
    });
  }
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  try {
    const doctor = await DoctorModel.findOne({ id: req.params.id })
      .select('-credentials.password')
      .populate('hospitalId', 'name address contact');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor'
    });
  }
}); 