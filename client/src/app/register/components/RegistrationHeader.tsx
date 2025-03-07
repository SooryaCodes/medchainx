"use client";

import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function RegistrationHeader() {
  return (
    <header className="border-b border-gray-100 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md p-1.5 shadow-sm">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MedChainX
          </span>
        </Link>
        
        <div className="flex items-center">
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
          >
            Already have an account? <span className="font-semibold underline underline-offset-2">Sign in</span>
          </Link>
        </div>
      </div>
    </header>
  );
} 