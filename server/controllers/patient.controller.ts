import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { PatientModel, IPatient } from '../models';
import { FHIRService } from '../services/fhir.service';
import bcrypt from 'bcryptjs';

// Interface for patient registration data from frontend
interface PatientRegistrationData {
  // Authentication Info
  username: string;
  password: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  
  // Contact Info
  email: string;
  phone: string;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Additional Fields
  bloodType: string;
  healthInsuranceId: string;
  nationalId: string;
}

// @desc    Register new patient
// @route   POST /api/patients/register
// @access  Public
export const registerPatient = catchAsync(async (
  req: Request<{}, {}, PatientRegistrationData>, 
  res: Response
) => {
  const patientData = req.body;

  // 1. Validate if user already exists
  const existingPatient = await PatientModel.findOne({ email: patientData.email });
  if (existingPatient) {
    return res.status(400).json({
      success: false,
      error: 'Patient with this email already exists'
    });
  }

  try {
    // Create MongoDB Patient document
    const patient = await PatientModel.create({
      username: patientData.username,
      password: bcrypt.hashSync(patientData.password, 10),
      name: {
        given: [patientData.firstName],
        family: patientData.lastName
      },
      birthDate: patientData.dateOfBirth,
      gender: patientData.gender,
      contact: {
        email: patientData.email,
        phone: patientData.phone
      },
      address: patientData.address,
      emergencyContact: patientData.emergencyContact,
      bloodType: patientData.bloodType,
      healthInsuranceId: patientData.healthInsuranceId,
      nationalId: patientData.nationalId,
      doctors: [],
      medicalReports: [],
      appointments: [],
      prescriptions: []
    });

    // Generate JWT token
    const token = patient.generateAuthToken();

    // Send response
    res.status(201).json({
      success: true,
      data: {
        patientId: patient._id,
        token
      },
      message: 'Patient registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Error registering patient'
    });
  }
});

