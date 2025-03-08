export interface PatientRegistrationData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
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
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  healthInsuranceId: string;
  nationalId: string;
}

export interface DoctorRegistrationData {
  username: string;
  password: string;
  given_name: string;
  family_name: string;
  email: string;
  phone: string;
  specialty: string;
  years_of_experience: string;
  license_number: string;
  consultation_fee: string;
  telemedicine_available: boolean;
  hospital_id: string;
  languages_spoken: string[];
  available_timings: {
    day: string;
    startTime: string;
    endTime: string;
    enabled: boolean;
  }[];
}

export interface RegistrationResponse {
  success: boolean;
  data: {
    patientId?: string;
    patientToken?: string;
    doctorId?: string;
    doctorToken?: string;
  };
  message: string;
} 