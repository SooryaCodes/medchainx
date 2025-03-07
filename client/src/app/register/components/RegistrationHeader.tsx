"use client";

import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function RegistrationHeader() {
  return (
    <header className="border-b border-blue-100 dark:border-blue-900/30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md p-1.5">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MedChainX
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </header>
  );
} 