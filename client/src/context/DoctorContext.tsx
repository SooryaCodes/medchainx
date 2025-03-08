"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import axiosInstance from '@/lib/axios';
import { Doctor } from '@/types/medical';

interface DoctorContextType {
  doctor: Doctor | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  fetchDoctor: () => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};

interface DoctorProviderProps {
  children: ReactNode;
}

export const DoctorProvider: React.FC<DoctorProviderProps> = ({ children }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['doctorToken', 'doctorId']);
  const router = useRouter();

  const isAuthenticated = !!token;

  const fetchDoctor = async () => {
    if (!cookies.doctorToken || !cookies.doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching doctor data...', {
        doctorId: cookies.doctorId,
        doctorToken: cookies.doctorToken
      });
      
      const response = await axiosInstance.get(`/doctor/${cookies.doctorId}`, {
        headers: {
          Authorization: `Bearer ${cookies.doctorToken}`
        }
      });
      console.log('Doctor data response:', response.data);
      
      if (response.data && response.data.data) {
        setDoctor(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch doctor data');
      }
    } catch (err: any) {
      console.error('Error fetching doctor data:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching doctor data');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('DoctorProvider checking for token...');
    // Check if token exists in cookies
    const storedToken = cookies.doctorToken;
    console.log('Stored token:', storedToken);
    
    if (storedToken) {
      setToken(storedToken);
      // Call fetchDoctor directly
      fetchDoctor();
    } else {
      setLoading(false);
      // Redirect to register page if not on register page already
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/register')) {
        router.push('/register');
      }
    }
  }, [cookies.doctorToken]);

  const logout = () => {
    // Clear cookies with the same path and domain options used when setting them
    removeCookie('doctorToken', { path: '/' });
    removeCookie('doctorId', { path: '/' });
    
    setToken(null);
    setDoctor(null);
    
    // Force a redirect to register page
    router.push('/register');
  };

  const value = {
    doctor,
    loading,
    error,
    token,
    isAuthenticated,
    logout,
    fetchDoctor
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
}; 