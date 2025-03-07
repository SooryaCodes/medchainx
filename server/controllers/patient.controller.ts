import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { PatientModel, IPatient } from '../models';
import { FHIRService } from '../services/fhir.service';
import bcrypt from 'bcryptjs';

// Interface for patient registration data from frontend
interface PatientRegistrationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  profileImage?: string;

  // Address Information
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  // Medical Information
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  
  // Emergency Contact
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };

  // Additional Information
  preferredLanguage?: string;
  nationality?: string;
  maritalStatus?: string;
  occupation?: string;
  
  // Insurance Information
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    validUntil?: string;
  };
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
    // 2. Create FHIR Patient resource
    const fhirPatient = await FHIRService.createPatient({
      name: {
        family: patientData.lastName,
        given: [patientData.firstName]
      },
      gender: patientData.gender,
      birthDate: patientData.dateOfBirth,
      contact: {
        phone: patientData.phone,
        email: patientData.email
      },
      address: patientData.address,
      emergencyContact: patientData.emergencyContact,
      preferredLanguage: patientData.preferredLanguage,
      nationality: patientData.nationality,
      maritalStatus: patientData.maritalStatus,
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/patient-bloodType",
          valueString: patientData.bloodType
        }
      ]
    });

    // 3. Create MongoDB Patient document
    const patient = await PatientModel.create({
      ...patientData,
      fhirId: fhirPatient.id,
      doctors: [],
      medicalReports: [],
      appointments: [],
      prescriptions: []
    });

    // 4. Generate JWT token
    const token = patient.generateAuthToken();

    // 5. Send response
    res.status(201).json({
      success: true,
      data: {
        patientId: patient._id,
        token
      },
      message: 'Patient registered successfully'
    });
  } catch (error) {
    // If FHIR creation fails, ensure we don't have orphaned records
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Error registering patient'
    });
  }
});

