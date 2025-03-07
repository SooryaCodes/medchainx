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
      height,
      weight,
      chronicConditions,
      medications,
      insuranceInfo,
      vaccinationHistory,
      maritalStatus,
      occupation
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
      nationality,
      maritalStatus
    });

    // Create MongoDB patient document
    const patient = new PatientModel({
      resourceType: "Patient",
      id: fhirPatient.id,
      name,
      birthDate,
      gender,
      contact,
      address,
      emergencyContact,
      hospitalId,
      doctors: [],
      medicalReports: [],
      // Additional health data fields
      allergies: allergies || [],
      bloodType,
      height,
      weight,
      chronicConditions: chronicConditions || [],
      medications: medications || [],
      insuranceInfo,
      vaccinationHistory: vaccinationHistory || [],
      preferredLanguage,
      nationality,
      maritalStatus,
      occupation,
      lastVisitDate: new Date()
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
    const {
      name,
      birthDate,
      gender,
      contact,
      address,
      emergencyContact,
      allergies,
      bloodType,
      height,
      weight,
      chronicConditions,
      medications,
      insuranceInfo,
      vaccinationHistory,
      preferredLanguage,
      nationality,
      maritalStatus,
      occupation
    } = req.body;

    // Find patient first to get the FHIR ID
    const existingPatient = await PatientModel.findOne({ id: req.params.id });
    
    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Update FHIR Patient resource if core medical data is changed
    if (name || birthDate || gender || contact || address || emergencyContact || preferredLanguage || nationality || maritalStatus) {
      // Prepare data for FHIR update
      const fhirUpdateData = {
        ...existingPatient.toObject(),
        name: name || existingPatient.name,
        birthDate: birthDate || existingPatient.birthDate,
        gender: gender || existingPatient.gender,
        contact: contact || existingPatient.contact,
        address: address || existingPatient.address,
        emergencyContact: emergencyContact || existingPatient.emergencyContact,
        preferredLanguage: preferredLanguage || existingPatient.preferredLanguage,
        nationality: nationality || existingPatient.nationality,
        maritalStatus: maritalStatus || existingPatient.maritalStatus
      };

      // Update FHIR resource
      await FHIRService.updatePatient(existingPatient.id, fhirUpdateData);
    }

    // Update MongoDB document with all fields
    const updatedPatient = await PatientModel.findOneAndUpdate(
      { id: req.params.id },
      {
        ...(name && { name }),
        ...(birthDate && { birthDate }),
        ...(gender && { gender }),
        ...(contact && { contact }),
        ...(address && { address }),
        ...(emergencyContact && { emergencyContact }),
        ...(allergies && { allergies }),
        ...(bloodType && { bloodType }),
        ...(height && { height }),
        ...(weight && { weight }),
        ...(chronicConditions && { chronicConditions }),
        ...(medications && { medications }),
        ...(insuranceInfo && { insuranceInfo }),
        ...(vaccinationHistory && { vaccinationHistory }),
        ...(preferredLanguage && { preferredLanguage }),
        ...(nationality && { nationality }),
        ...(maritalStatus && { maritalStatus }),
        ...(occupation && { occupation }),
        lastVisitDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('hospitalId', 'name').populate('doctors', 'name specialty');
    
    res.status(200).json({
      success: true,
      data: updatedPatient
    });
  } catch (error: any) {
    console.error('Error updating patient:', error);
    
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

// Delete patient
export const deletePatient = async (req: Request, res: Response) => {
  try {
    // Find patient first to get the FHIR ID
    const patient = await PatientModel.findOne({ id: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Delete from FHIR server first
    await FHIRService.deletePatient(patient.id);

    // Remove patient from hospital
    if (patient.hospitalId) {
      await HospitalModel.findByIdAndUpdate(
        patient.hospitalId,
        { $pull: { patients: patient._id } }
      );
    }

    // Remove patient from doctors' patient lists
    for (const doctorId of patient.doctors) {
      await DoctorModel.findByIdAndUpdate(
        doctorId,
        { $pull: { patients: patient._id } }
      );
    }

    // Delete from MongoDB
    await PatientModel.findOneAndDelete({ id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
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

// Export patient data in FHIR format
export const exportPatientFHIR = async (req: Request, res: Response) => {
  try {
    const patient = await PatientModel.findOne({ id: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Get FHIR representation from FHIR server
    const fhirPatient = await FHIRService.getPatient(patient.id);

    // Get related FHIR resources
    const fhirParams = { patient: `Patient/${patient.id}` };
    const encounters = await FHIRService.searchResources('Encounter', fhirParams);
    const medicationRequests = await FHIRService.searchResources('MedicationRequest', fhirParams);
    const diagnosticReports = await FHIRService.searchResources('DiagnosticReport', fhirParams);

    // Create a FHIR Bundle with all resources
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          resource: fhirPatient
        },
        ...(encounters.entry || []),
        ...(medicationRequests.entry || []),
        ...(diagnosticReports.entry || [])
      ]
    };

    res.status(200).json({
      success: true,
      data: bundle
    });
  } catch (error) {
    console.error('Error exporting patient FHIR data:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get patient's medical history
export const getPatientMedicalHistory = async (req: Request, res: Response) => {
  try {
    const patient = await PatientModel.findOne({ id: req.params.id })
      .populate({
        path: 'medicalReports',
        populate: {
          path: 'doctorId',
          select: 'name specialty'
        }
      });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Get FHIR resources for comprehensive medical history
    const fhirParams = { patient: `Patient/${patient.id}` };
    
    // Get encounters, medications, and diagnostic reports from FHIR
    const [encounters, medications, diagnosticReports] = await Promise.all([
      FHIRService.searchResources('Encounter', fhirParams),
      FHIRService.searchResources('MedicationRequest', fhirParams),
      FHIRService.searchResources('DiagnosticReport', fhirParams)
    ]);

    // Organize data chronologically
    const medicalHistory = {
      patientInfo: {
        id: patient.id,
        name: patient.name,
        birthDate: patient.birthDate,
        gender: patient.gender,
        bloodType: patient.bloodType,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions
      },
      encounters: encounters.entry?.map((entry: any) => entry.resource) || [],
      medications: medications.entry?.map((entry: any) => entry.resource) || [],
      diagnosticReports: diagnosticReports.entry?.map((entry: any) => entry.resource) || [],
      medicalReports: patient.medicalReports || []
    };

    res.status(200).json({
      success: true,
      data: medicalHistory
    });
  } catch (error) {
    console.error('Error getting patient medical history:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Remove doctor from patient
export const removeDoctorFromPatient = async (req: Request, res: Response) => {
  try {
    const { id, doctorId } = req.params;

    // Check if patient exists
    const patient = await PatientModel.findOne({ id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    // Remove doctor from patient
    await PatientModel.findOneAndUpdate(
      { id },
      { $pull: { doctors: doctorId } }
    );

    // Remove patient from doctor
    await DoctorModel.findByIdAndUpdate(
      doctorId,
      { $pull: { patients: patient._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Doctor removed from patient successfully'
    });
  } catch (error) {
    console.error('Error removing doctor from patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get patient's medical reports
export const getPatientMedicalReports = async (req: Request, res: Response) => {
  try {
    const patient = await PatientModel.findOne({ id: req.params.id })
      .populate({
        path: 'medicalReports',
        populate: {
          path: 'doctorId',
          select: 'name specialty'
        }
      });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      count: patient.medicalReports.length,
      data: patient.medicalReports
    });
  } catch (error) {
    console.error('Error getting patient medical reports:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get patient's doctors
export const getPatientDoctors = async (req: Request, res: Response) => {
  try {
    const patient = await PatientModel.findOne({ id: req.params.id })
      .populate('doctors', 'name specialty hospitalId qualifications yearsOfExperience consultationFee');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      count: patient.doctors.length,
      data: patient.doctors
    });
  } catch (error) {
    console.error('Error getting patient doctors:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};