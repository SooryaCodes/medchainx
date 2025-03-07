import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PatientModel, IPatient } from '../models';

// Helper function to create FHIR Patient resource
const createFHIRPatient = (patientData: any) => {
  return {
    resourceType: "Patient",
    id: uuidv4(),
    name: [
      {
        use: "official",
        family: patientData.name.family,
        given: patientData.name.given
      }
    ],
    gender: patientData.gender,
    birthDate: patientData.birthDate,
    telecom: [
      patientData.contact.phone ? {
        system: "phone",
        value: patientData.contact.phone,
        use: "home"
      } : null,
      patientData.contact.email ? {
        system: "email",
        value: patientData.contact.email
      } : null
    ].filter(Boolean),
    contact: [
      {
        relationship: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                code: "C",
                display: "Emergency Contact"
              }
            ]
          }
        ],
        name: {
          text: patientData.emergencyContact.name
        },
        telecom: [
          {
            system: "phone",
            value: patientData.emergencyContact.phone
          }
        ]
      }
    ]
  };
};

// Register a new patient
export const registerPatient = async (req: Request, res: Response) => {
  try {
    const {
      name,
      birthDate,
      gender,
      contact,
      emergencyContact,
      hospitalId
    } = req.body;

    // Create FHIR Patient resource
    const fhirPatient = createFHIRPatient({
      name,
      birthDate,
      gender,
      contact,
      emergencyContact
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
      medicalReports: []
    });

    // Save patient to MongoDB
    await patient.save();

    res.status(201).json({
      success: true,
      data: {
        fhirResource: fhirPatient,
        patient
      }
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await PatientModel.find();
    
    res.status(200).json({
      success: true,
      count: patients.length,
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