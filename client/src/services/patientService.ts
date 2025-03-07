import axiosInstance from '@/lib/axios';
import { getAuthHeader } from '@/lib/auth';
import { Patient, MedicalReport, HealthMetrics, ChartData, RiskFactor } from '@/types/medical';

export const getPatientById = async (patientId: string) => {
  try {
    const response = await axiosInstance.get(`/patient/${patientId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientMedicalRecords = async (patientId: string) => {
  try {
    const response = await axiosInstance.get(`/patient/${patientId}/medical-records`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientHealthMetrics = async (patientId: string) => {
  try {
    const response = await axiosInstance.get(`/patient/${patientId}/health-metrics`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientChartData = async (patientId: string, period: string = 'month') => {
  try {
    const response = await axiosInstance.get(`/patient/${patientId}/chart-data?period=${period}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientRiskFactors = async (patientId: string) => {
  try {
    const response = await axiosInstance.get(`/patient/${patientId}/risk-factors`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateAccessToken = async (patientId: string, duration: number = 30) => {
  try {
    const response = await axiosInstance.post(
      `/patient/${patientId}/generate-token`, 
      { duration },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePatientProfile = async (patientId: string, profileData: Partial<Patient>) => {
  try {
    const response = await axiosInstance.put(
      `/patient/${patientId}`, 
      profileData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}; 