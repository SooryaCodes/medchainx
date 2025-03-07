import mongoose, { Schema, Document } from "mongoose";

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
  resourceType: "Patient";
  id: string;
  name: { given: string[]; family: string };
  birthDate: Date;
  gender: string;
  contact: { phone?: string; email?: string };
  address?: { street?: string; city?: string; state?: string; country?: string; postalCode?: string };
  emergencyContact: { name: string; phone: string; relationship?: string };
  hospitalId: mongoose.Types.ObjectId;
  doctors: mongoose.Types.ObjectId[];
  medicalReports: mongoose.Types.ObjectId[];
  // Additional health data fields
  allergies?: string[];
  bloodType?: string;
  height?: number; // in cm
  weight?: number; // in kg
  chronicConditions?: string[];
  medications?: { name: string; dosage: string; frequency: string; startDate?: Date; endDate?: Date }[];
  insuranceInfo?: { provider: string; policyNumber: string; expiryDate?: Date };
  vaccinationHistory?: { name: string; date: Date; batchNumber?: string }[];
  preferredLanguage?: string;
  nationality?: string;
  maritalStatus?: string;
  occupation?: string;
  lastVisitDate?: Date;
}

const PatientSchema = new Schema<IPatient>({
  resourceType: { type: String, default: "Patient" },
  id: { type: String, required: true, unique: true },
  name: { given: [{ type: String, required: true }], family: { type: String, required: true } },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  contact: { phone: String, email: String },
  address: { street: String, city: String, state: String, country: String, postalCode: String },
  emergencyContact: { name: String, phone: String, relationship: String },
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
  doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
  medicalReports: [{ type: Schema.Types.ObjectId, ref: "MedicalReport" }],
  // Additional health data fields
  allergies: [{ type: String }],
  bloodType: { type: String },
  height: { type: Number },
  weight: { type: Number },
  chronicConditions: [{ type: String }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date
  }],
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  vaccinationHistory: [{
    name: String,
    date: Date,
    batchNumber: String
  }],
  preferredLanguage: { type: String },
  nationality: { type: String },
  maritalStatus: { type: String },
  occupation: { type: String },
  lastVisitDate: { type: Date }
});

export const PatientModel = mongoose.model<IPatient>("Patient", PatientSchema);

// 4️⃣ Medical Report Schema
export interface IMedicalReport extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: Date;
  diagnosis: string;
  prescriptions: { medicine: string; dosage: string; duration: string }[];
  additionalNotes?: string;
  healthCaseTips?: string;
  attachedReports?: { url: string; type: string }[]; // Stores links to reports, images, PDFs
}

const MedicalReportSchema = new Schema<IMedicalReport>({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  prescriptions: [{ medicine: String, dosage: String, duration: String }],
  additionalNotes: { type: String },
  healthCaseTips: { type: String },
  attachedReports: [{ url: String, type: String }],
});

export const MedicalReportModel = mongoose.model<IMedicalReport>("MedicalReport", MedicalReportSchema); 