import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";

// 1️⃣ Hospital Schema
export interface IHospital extends Document {
  resourceType: "Organization";
  id: string;
  name: string;
  address: { street?: string; city?: string; state?: string; country?: string; postalCode?: string };
  contact: { phone?: string; email?: string; website?: string };
  departments: { name: string; headDoctorId?: mongoose.Types.ObjectId }[];
  services: string[]; // Available medical services
  doctors: mongoose.Types.ObjectId[];
  patients: mongoose.Types.ObjectId[];
  emergencyServices: boolean;
  telemedicineAvailable: boolean;
  certifications: string[];
  billingInfo: { acceptedInsurances: string[]; paymentMethods: string[] };
  operatingHours: { day: string; openTime: string; closeTime: string }[];
}

const HospitalSchema = new Schema<IHospital>({
  resourceType: { type: String, default: "Organization" },
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { street: String, city: String, state: String, country: String, postalCode: String },
  contact: { phone: String, email: String, website: String },
  departments: [{ name: String, headDoctorId: { type: Schema.Types.ObjectId, ref: "Doctor" } }],
  services: [{ type: String }],
  doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
  patients: [{ type: Schema.Types.ObjectId, ref: "Patient" }],
  emergencyServices: { type: Boolean, default: false },
  telemedicineAvailable: { type: Boolean, default: false },
  certifications: [{ type: String }],
  billingInfo: { acceptedInsurances: [{ type: String }], paymentMethods: [{ type: String }] },
  operatingHours: [{ day: String, openTime: String, closeTime: String }],
});

export const HospitalModel = mongoose.model<IHospital>("Hospital", HospitalSchema);

// 2️⃣ Doctor Schema
export interface IDoctor extends Document {
  resourceType: "Practitioner";
  id: string;
  name: { given: string[]; family: string };
  specialty: string;
  hospitalId: mongoose.Types.ObjectId;
  qualifications: { degree: string; institution: string; year: number }[];
  yearsOfExperience: number;
  availableTimings: { day: string; startTime: string; endTime: string }[];
  contact: { phone: string; email?: string };
  consultationFee: number;
  telemedicineAvailable: boolean;
  languagesSpoken: string[];
  reviews?: { patientId: mongoose.Types.ObjectId; rating: number; comment?: string }[];
}

const DoctorSchema = new Schema<IDoctor>({
  resourceType: { type: String, default: "Practitioner" },
  id: { type: String, required: true, unique: true },
  name: { given: [{ type: String, required: true }], family: { type: String, required: true } },
  specialty: { type: String, required: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
  qualifications: [{ degree: String, institution: String, year: Number }],
  yearsOfExperience: { type: Number, required: true },
  availableTimings: [{ day: String, startTime: String, endTime: String }],
  contact: { phone: String, email: String },
  consultationFee: { type: Number },
  telemedicineAvailable: { type: Boolean, default: false },
  languagesSpoken: [{ type: String }],
  reviews: [{ patientId: { type: Schema.Types.ObjectId, ref: "Patient" }, rating: Number, comment: String }],
});

export const DoctorModel = mongoose.model<IDoctor>("Doctor", DoctorSchema);

// 3️⃣ Patient Schema
export interface IPatient extends Document {
  username: string;
  password: string;
  name: {
    given: string[];
    family: string;
  };
  birthDate: string;
  gender: string;
  contact: {
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bloodType: string;
  healthInsuranceId: string;
  nationalId: string;
  doctors: mongoose.Types.ObjectId[];
  medicalReports: IMedicalReport[];
  generateAuthToken(): string;
}

export interface IMedicalReport extends Document {
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

const MedicalReportSchema = new Schema<IMedicalReport>({
  title: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['general', 'prescription', 'labReport', 'doctorNote', 'referral', 'imaging']
  },
  content: { type: String, required: true },
  
  prescription: {
    medication: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    instructions: String
  },
  
  labReport: {
    testName: String,
    testDate: Date,
    results: [{
      parameter: String,
      value: String,
      normalRange: String,
      interpretation: String
    }],
    labName: String,
    technician: String
  },
  
  imaging: {
    type: { 
      type: String,
      enum: ['xray', 'mri', 'ct', 'ultrasound', 'other']
    },
    bodyPart: String,
    findings: String,
    impression: String,
    recommendations: String
  },
  
  attachments: [{
    name: String,
    fileType: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  
  status: { 
    type: String, 
    required: true, 
    enum: ['draft', 'final', 'amended'],
    default: 'draft'
  },
  tags: [String]
}, {
  timestamps: true
});

const PatientSchema = new Schema<IPatient>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    given: [{ type: String, required: true }],
    family: { type: String, required: true }
  },
  birthDate: { type: String, required: true },
  gender: { type: String, required: true },
  contact: {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  },
  bloodType: { type: String },
  healthInsuranceId: { type: String },
  nationalId: { type: String },
  doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
  medicalReports: [MedicalReportSchema]
}, {
  timestamps: true
});

// Add method to generate JWT token
PatientSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

export const MedicalReportModel = mongoose.model<IMedicalReport>('MedicalReport', MedicalReportSchema);
export const PatientModel = mongoose.model<IPatient>('Patient', PatientSchema);

// Add Prescription schema definition
export interface IPrescription extends Document {
  medication: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  instructions: string;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>({
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  instructions: { type: String },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true }
}, {
  timestamps: true
});

export const PrescriptionModel = mongoose.model<IPrescription>('Prescription', PrescriptionSchema);