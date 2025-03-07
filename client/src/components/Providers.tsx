"use client";

import { PatientProvider } from '@/context/PatientContext';
import { CookiesProvider } from 'react-cookie';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <PatientProvider>
        {children}
      </PatientProvider>
    </CookiesProvider>
  );
} 