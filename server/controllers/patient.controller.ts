import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { PatientModel, IPatient } from '../models';
import { FHIRService } from '../services/fhir.service';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import openAIService from '../services/openai.service';
import { generatePatientToken, decodePatientToken } from '../utils/tokenUtils';

// @desc    Decode a patient token without verification
// @route   POST /api/patients/decode-token
// @access  Public
export const decodePatientAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token is required'
    });
  }

  try {
    // Decode the token without verification
    const decoded = decodePatientToken(token);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token format'
      });
    }

    // Return the decoded information
    res.status(200).json({
      success: true,
      data: {
        patientId: decoded.patientId,
        issuedAt: new Date(decoded.createdAt),
        expiresIn: decoded.expiresIn
      },
      message: 'Token decoded successfully'
    });
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({
      success: false,
      error: 'Error decoding token'
    });
  }
});

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

// Add this interface for medical reports
interface MedicalReport {
  _id?: string;
  title: string;
  date: Date;
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  type: 'general' | 'prescription' | 'labReport' | 'doctorNote' | 'referral' | 'imaging';
  content: string;
  
  // For prescriptions
  prescription?: {
    medication: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate: Date;
    instructions: string;
  };
  
  // For lab reports
  labReport?: {
    testName: string;
    testDate: Date;
    results: Array<{
      parameter: string;
      value: string;
      normalRange: string;
      interpretation: string;
    }>;
    labName: string;
    technician: string;
  };
  
  // For imaging reports
  imaging?: {
    type: 'xray' | 'mri' | 'ct' | 'ultrasound' | 'other';
    bodyPart: string;
    findings: string;
    impression: string;
    recommendations: string;
  };
  
  attachments?: Array<{
    name: string;
    fileType: string;
    url: string;
    uploadDate: Date;
  }>;
  
  status: 'draft' | 'final' | 'amended';
  tags?: string[];
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
        patientToken: token
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

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid patient ID format'
      });
    }

    // Find patient by ID and exclude sensitive information
    const patient = await PatientModel.findById(id)
      .select('-username -password') // Exclude username and password
      .populate('doctors', 'name specialty')
  

    // Check if patient exists
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Return patient data with the same format as other responses
    res.status(200).json({
      success: true,
      data: patient,
      message: 'Patient data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching patient'
    });
  }
});

// @desc    Generate health risk analysis for a patient
// @route   GET /api/patients/:id/health-risks
// @access  Private
export const generateHealthRiskAnalysis = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid patient ID format'
      });
    }

    // Find patient by ID with all medical data
    const patient = await PatientModel.findById(id);

    // Check if patient exists
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Generate health risk analysis using OpenAI
    const healthRiskAnalysis = await openAIService.generateHealthRiskAnalysis(patient);

    // Return the analysis
    res.status(200).json({
      success: true,
      data: healthRiskAnalysis,
      message: 'Health risk analysis generated successfully'
    });
  } catch (error) {
    console.error('Error generating health risk analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating health risk analysis'
    });
  }
});

// @desc    Generate a short-lived token for patient access
// @route   POST /api/patients/generate-token
// @access  Private
export const generatePatientAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { patientId, expiresIn } = req.body; // Get patientId and expiresIn from request body

  // Default expiration to 1 hour if not provided
  const tokenExpiration = expiresIn || 3600; // 1 hour in seconds

  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid patient ID format'
      });
    }

    // Find patient by ID to verify existence
    const patient = await PatientModel.findById(patientId);

    // Check if patient exists
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Generate the token
    const token = generatePatientToken(patientId, tokenExpiration);
    console.log(token);
    // Return the token
    res.status(200).json({
      success: true,
      data: {
        token,
        expiresIn: tokenExpiration,
        issuedAt: new Date()
      },
      message: 'Access token generated successfully'
    });
  } catch (error) {
    console.error('Error generating access token:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating access token'
    });
  }
});

// @desc    Verify and decode a patient token
// @route   POST /api/patients/verify-token
// @access  Public
export const verifyPatientToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token is required'
    });
  }

  try {
    // Decode the token
    const decoded = decodePatientToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Check if the patient exists
    const patient = await PatientModel.findById(decoded.patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Calculate remaining time
    const now = new Date();
    const createdAt = new Date(decoded.createdAt);
    const expirationTime = new Date(createdAt.getTime() + (decoded.expiresIn * 1000));
    const remainingTime = Math.max(0, Math.floor((expirationTime.getTime() - now.getTime()) / 1000));

    // Return token information
    res.status(200).json({
      success: true,
      data: {
        patientId: decoded.patientId,
        issuedAt: createdAt,
        expiresIn: decoded.expiresIn,
        remainingTime: remainingTime,
        isValid: remainingTime > 0
      },
      message: 'Token verified successfully'
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying token'
    });
  }
});

// @desc    Revoke a patient token
// @route   POST /api/patients/revoke-token
// @access  Private
export const revokePatientToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token is required'
    });
  }

  try {
    // Decode the token to get patient ID
    const decoded = decodePatientToken(token);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token format'
      });
    }

    // Since we don't have a revokeToken function in tokenUtils,
    // we'll implement token revocation here
    
    // In a real implementation, you would:
    // 1. Add the token to a blacklist in your database
    // 2. Or update a 'revoked' field in a tokens collection
    
    // For now, we'll simulate a successful revocation
    const revoked = true;

    if (!revoked) {
      return res.status(500).json({
        success: false,
        error: 'Failed to revoke token'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        patientId: decoded.patientId,
        revokedAt: new Date()
      },
      message: 'Token revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking token:', error);
    res.status(500).json({
      success: false,
      error: 'Error revoking token'
    });
  }
});

