"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import axiosInstance from '@/lib/axios';
import { Patient } from '@/types/medical';
interface PatientContextType {
  patient: Patient | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  fetchPatient: () => Promise<void>;
  remainingTime: string | null;
  setRemainingTime: (time: string | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['patientToken', 'patientId']);
  const router = useRouter();

  const isAuthenticated = !!token;

  const fetchPatient = async () => {
    if (!cookies.patientToken || !cookies.patientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching patient data...', {
        patientId: cookies.patientId,
        patientToken: cookies.patientToken
      });
      
      const response = await axiosInstance.get(`/patient/${cookies.patientId}`, {
        headers: {
          Authorization: `Bearer ${cookies.patientToken}`
        }
      });
      console.log('Patient data response:', response.data);
      
      if (response.data && response.data.data) {
        setPatient(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch patient data');
      }
    } catch (err: any) {
      console.error('Error fetching patient data:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching patient data');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('PatientProvider checking for token...');
    // Check if token exists in cookies
    const storedToken = cookies.patientToken;
    console.log('Stored token:', storedToken);
    
    if (storedToken) {
      setToken(storedToken);
      // Call fetchPatient directly
      fetchPatient();
    } else {
      setLoading(false);
      // Redirect to register page if not on register page already
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/register')) {
        router.push('/register');
      }
    }
  }, [cookies.patientToken]);

  const logout = () => {
    // Clear cookies with the same path and domain options used when setting them
    removeCookie('patientToken', { path: '/' });
    removeCookie('patientId', { path: '/' });
    
    // Also clear any MedChainX related tokens
    document.cookie = "medToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "medTokenExpiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "medTokenCreated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    setToken(null);
    setPatient(null);
    
    // Force a redirect to register page
    router.push('/register');
  };

  const value = {
    patient,
    loading,
    error,
    token,
    isAuthenticated,
    logout,
    fetchPatient,
    remainingTime,
    setRemainingTime
  };

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}; 