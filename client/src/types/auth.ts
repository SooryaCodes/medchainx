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

export interface RegistrationResponse {
  success: boolean;
  data: {
    patientId: string;
    token: string;
  };
  message: string;
} 