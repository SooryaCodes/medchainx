import { useCookies } from 'react-cookie';
import axiosInstance from './axios';
import { RegistrationResponse } from '@/types/auth';

export const setAuthCookies = (response: RegistrationResponse) => {
  const [cookies, setCookie] = useCookies(['patientToken', 'patientId']);
  
  if (response.success && response.data) {
    // Set cookies with expiry of 7 days
    setCookie('patientToken', response.data.patientToken, { path: '/', maxAge: 7 * 24 * 60 * 60 });
    setCookie('patientId', response.data.patientId, { path: '/', maxAge: 7 * 24 * 60 * 60 });
    return true;
  }
  
  return false;
};

export const getAuthHeader = () => {
  const [cookies] = useCookies(['patientToken']);
  
  if (cookies.patientToken) {
    return {
      Authorization: `Bearer ${cookies.patientToken}`
    };
  }
  
  return {};
};

export const loginPatient = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
      role: 'patient'
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerPatient = async (patientData: any) => {
  try {
    const response = await axiosInstance.post('/auth/register/patient', patientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginDoctor = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
      role: 'doctor'
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
}; 