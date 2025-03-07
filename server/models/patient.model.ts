import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IPatient extends Document {
  resourceType: string;
  fhirId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  preferredLanguage?: string;
  nationality?: string;
  maritalStatus?: string;
  occupation?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    validUntil?: string;
  };
  doctors: mongoose.Types.ObjectId[];
  medicalReports: mongoose.Types.ObjectId[];
  appointments: mongoose.Types.ObjectId[];
  prescriptions: mongoose.Types.ObjectId[];
  lastVisitDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  generateAuthToken: () => string;
}

const patientSchema = new Schema<IPatient>({
  resourceType: { type: String, required: true, default: 'Patient' },
  fhirId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  profileImage: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  preferredLanguage: String,
  nationality: String,
  maritalStatus: String,
  occupation: String,
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    validUntil: String
  },
  doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
  medicalReports: [{ type: Schema.Types.ObjectId, ref: 'MedicalReport' }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }],
  lastVisitDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add index for email
patientSchema.index({ email: 1 }, { unique: true });

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT token
patientSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { id: this._id, role: 'patient' },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );
};

// Match password
patientSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const PatientModel = mongoose.model<IPatient>('Patient', patientSchema); 