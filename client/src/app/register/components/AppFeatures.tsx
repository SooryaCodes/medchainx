"use client";

import { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Shield, 
  Clock, 
  Users, 
  Zap, 
  Globe, 
  Lock, 
  FileText,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: <HeartPulse className="h-6 w-6 text-blue-600" />,
    title: "Comprehensive Records",
    description: "Store complete patient histories in one secure location with easy access and management."
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: "Advanced Security",
    description: "HIPAA-compliant data protection with end-to-end encryption for all medical records."
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: "Real-time Updates",
    description: "Instant synchronization across all devices ensures your data is always current."
  },
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: "Team Collaboration",
    description: "Seamless coordination between healthcare providers for better patient care."
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    title: "Fast Performance",
    description: "Lightning-fast access to medical records when you need them most."
  },
  {
    icon: <Globe className="h-6 w-6 text-blue-600" />,
    title: "Global Access",
    description: "Access your medical information securely from anywhere in the world."
  },
  {
    icon: <Lock className="h-6 w-6 text-blue-600" />,
    title: "Privacy Controls",
    description: "Granular permission settings to control who can access your medical data."
  },
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: "Digital Prescriptions",
    description: "Generate and manage prescriptions digitally with automatic refill reminders."
  }
];

export default function AppFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-8 ">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-3">
          Welcome to MedChainX
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The next generation healthcare management platform designed for patients, doctors, and hospitals
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3 mr-4">
            {features[activeIndex].icon}
          </div>
          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            {features[activeIndex].title}
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 pl-14">
          {features[activeIndex].description}
        </p>
        
        <div className="flex justify-center gap-2 mb-6">
          {features.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex 
                  ? "bg-blue-600 w-6" 
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        
        <div className="space-y-3 mt-8 max-h-[300px] overflow-y-auto pr-2">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex items-start p-3 rounded-lg transition-all ${
                index === activeIndex 
                  ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <div className={`flex-shrink-0 mr-3 mt-1 ${index === activeIndex ? "text-blue-600" : "text-gray-400"}`}>
                {index === activeIndex ? <CheckCircle className="h-5 w-5" /> : feature.icon}
              </div>
              <div>
                <h4 className={`font-medium ${
                  index === activeIndex ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                }`}>
                  {feature.title}
                </h4>
                {index === activeIndex && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 