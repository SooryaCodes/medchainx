import { Types } from 'mongoose';

// Hospital interface
export interface Hospital {
  resourceType: "Organization";
  id: string;
  name: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  departments: {
    name: string;
    headDoctorId?: string;
  }[];
  services: string[];
  doctors: string[];
  patients: string[];
  emergencyServices: boolean;
  telemedicineAvailable: boolean;
  certifications: string[];
  billingInfo: {
    acceptedInsurances: string[];
    paymentMethods: string[];
  };
  operatingHours: {
    day: string;
    openTime: string;
    closeTime: string;
  }[];
}

// Doctor interface
export interface Doctor {
  resourceType: "Practitioner";
  id: string;
  name: {
    given: string[];
    family: string;
  };
  specialty: string;
  hospitalId: string;
  qualifications: {
    degree: string;
    institution: string;
    year: number;
  }[];
  yearsOfExperience: number;
  availableTimings: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  contact: {
    phone: string;
    email?: string;
  };
  consultationFee: number;
  telemedicineAvailable: boolean;
  languagesSpoken: string[];
  reviews?: {
    patientId: string;
    rating: number;
    comment?: string;
  }[];
}

// Patient interface
export interface Patient {
  resourceType: "Patient";
  id: string;
  name: {
    given: string[];
    family: string;
  };
  birthDate: Date;
  gender: string;
  contact: {
    phone?: string;
    email?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship?: string;
  };
  hospitalId: string;
  doctors: string[];
  medicalReports: string[];
  allergies?: string[];
  bloodType?: string;
  height?: number;
  weight?: number;
  chronicConditions?: string[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate?: Date;
    endDate?: Date;
  }[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate?: Date;
  };
  vaccinationHistory?: {
    name: string;
    date: Date;
    batchNumber?: string;
  }[];
  preferredLanguage?: string;
  nationality?: string;
  maritalStatus?: string;
  occupation?: string;
  lastVisitDate?: Date;
}

// Medical Report interface
export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  diagnosis: string;
  prescriptions: {
    medicine: string;
    dosage: string;
    duration: string;
  }[];
  additionalNotes?: string;
  healthCaseTips?: string;
  attachedReports?: {
    url: string;
    type: string;
  }[];
}

// Enhanced interfaces for the dashboard
export interface HealthMetric {
  current: number;
  min: number;
  max: number;
  trend: {
    value: number;
    isPositive: boolean;
  };
}

export interface HealthMetrics {
  heartRate: HealthMetric;
  bloodPressure: {
    systolic: number;
    diastolic: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  temperature: HealthMetric;
  oxygenLevel: HealthMetric;
  weight: {
    current: number;
    target: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  bloodSugar: HealthMetric;
  cholesterol: HealthMetric;
  bmi: HealthMetric;
  respiratoryRate: HealthMetric;
}

export interface ChartData {
  heartRate: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  bloodPressure: {
    systolic: number[];
    diastolic: number[];
  };
  weight: number[];
  bloodSugar: {
    fasting: number[];
    postMeal: number[];
  };
  cholesterol: {
    total: number[];
    ldl: number[];
    hdl: number[];
  };
  oxygenLevel: number[];
  respiratoryRate: number[];
  temperature: number[];
  bmi: number[];
}

export interface RiskFactor {
  name: string;
  risk: "High" | "Moderate" | "Low";
  score: number;
  symptoms: string[];
  remedies: string[];
  recommendations: string[];
}

export interface EnhancedMedicalReport extends MedicalReport {
  doctor: {
    name: string;
    specialty: string;
    hospital: string;
    contact: string;
  };
  type: string;
  description: string;
  notes: string;
  labResults: {
    name: string;
    result: string;
    referenceRange: string;
    date: string;
  }[];
  followUp: string;
} 