import axiosInstance from '@/lib/axios';
import Cookies from 'js-cookie';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = Cookies.get('doctorToken');
  return {
    Authorization: `Bearer ${token}`
  };
};

// Get doctor profile
export const getDoctorProfile = async () => {
  try {
    const doctorId = Cookies.get('doctorId');
    const response = await axiosInstance.get(`/doctor/${doctorId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Access patient medical records with token
export const accessPatientRecords = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/patient/records/access`, {
      headers: {
        ...getAuthHeader(),
        'X-Access-Token': accessToken
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get patient medical record by ID
export const getPatientRecordById = async (patientId: string, recordId: string, accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/patient/${patientId}/records/${recordId}`, {
      headers: {
        ...getAuthHeader(),
        'X-Access-Token': accessToken
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate summary of patient medical records
export const generateRecordsSummary = async (patientId: string, accessToken: string) => {
  try {
    const response = await axiosInstance.post(`/patient/${patientId}/records/summarize`, {}, {
      headers: {
        ...getAuthHeader(),
        'X-Access-Token': accessToken
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 