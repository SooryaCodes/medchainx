export interface PatientRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: string;
}

export interface RegistrationResponse {
  success: boolean;
  data: {
    patientId: string;
    token: string;
  };
  message: string;
} 