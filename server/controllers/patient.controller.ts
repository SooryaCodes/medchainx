import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { PatientModel, IPatient, HospitalModel, DoctorModel } from '../models';
import { FHIRService } from '../services/fhir.service';

// Register a new patient
export const registerPatient = async (req: Request, res: Response) => {
  try {
    const {
      name,
      birthDate,
      gender,
      contact,
      address,
      emergencyContact,
      hospitalId,
      preferredLanguage,
      nationality,
      allergies,
      bloodType,
      insuranceInfo
    } = req.body;

    // Validate required fields
    if (!name || !name.given || !name.family || !birthDate || !gender || !emergencyContact || !hospitalId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name (given and family), birthDate, gender, emergencyContact, and hospitalId'
      });
    }

    // Check if hospital exists
    const hospital = await HospitalModel.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        error: 'Hospital not found'
      });
    }

    // Create FHIR Patient resource
    const fhirPatient = await FHIRService.createPatient({
      name,
      birthDate,
      gender,
      contact,
      address,
      emergencyContact,
      preferredLanguage,
      nationality
    });

    // Create MongoDB patient document
    const patient = new PatientModel({
      resourceType: "Patient",
      id: fhirPatient.id,
      name,
      birthDate,
      gender,
      contact,
      emergencyContact,
      hospitalId,
      doctors: [],
      medicalReports: [],
      // Additional fields not in FHIR but useful for the application
      allergies: allergies || [],
      bloodType,
      insuranceInfo
    });

    // Save patient to MongoDB
    await patient.save();

    // Update hospital with new patient
    await HospitalModel.findByIdAndUpdate(
      hospitalId,
      { $push: { patients: patient._id } }
    );

    res.status(201).json({
      success: true,
      data: {
        fhirResource: fhirPatient,
        patient
      }
    });
  } catch (error: any) {
    console.error('Error registering patient:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Patient with this ID already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    
    // Implement filtering
    const filter: any = {};
    
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }
    
    if (req.query.hospitalId) {
      filter.hospitalId = req.query.hospitalId;
    }
    
    // For doctor users, only show their patients
    if (req.user?.role === 'doctor' && req.user.doctorId) {
      filter.doctors = req.user.doctorId;
    }
    
    // For hospital users, only show their patients
    if (req.user?.role === 'hospital' && req.user.hospitalId) {
      filter.hospitalId = req.user.hospitalId;
    }
    
    // Count total documents for pagination
    const total = await PatientModel.countDocuments(filter);
    
    // Get patients with pagination
    const patients = await PatientModel.find(filter)
      .populate('hospitalId', 'name')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // If FHIR search is requested
    if (req.query.fhir === 'true') {
      // Convert MongoDB query to FHIR search parameters
      const fhirParams: any = {};
      
      if (req.query.gender) {
        fhirParams.gender = req.query.gender;
      }
      
      if (req.query.name) {
        fhirParams.name = req.query.name;
      }
      
      // Search FHIR server
      const fhirResults = await FHIRService.searchResources('Patient', fhirParams);
      
      return res.status(200).json({
        success: true,
        count: patients.length,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        },
        data: {
          mongoDb: patients,
          fhir: fhirResults
        }
      });
    }
    
    res.status(200).json({
      success: true,
      count: patients.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: patients
    });
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single patient
export const getPatient = async (req: Request, res: Response) => {
  try {
    const patient = await PatientModel.findOne({ id: req.params.id })
      .populate('hospitalId', 'name')
      .populate('doctors', 'name specialty')
      .populate('medicalReports');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update patient
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await PatientModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete patient
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await PatientModel.findOneAndDelete({ id: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add doctor to patient
export const addDoctorToPatient = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.body;
    
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a doctor ID'
      });
    }

    const patient = await PatientModel.findOne({ id: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Check if doctor already assigned to patient
    if (patient.doctors.includes(doctorId as any)) {
      return res.status(400).json({
        success: false,
        error: 'Doctor already assigned to this patient'
      });
    }

    patient.doctors.push(doctorId as any);
    await patient.save();

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error adding doctor to patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};