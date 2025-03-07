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
  FileText 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <HeartPulse className="h-8 w-8 text-blue-600" />,
    title: "Comprehensive Records",
    description: "Store complete patient histories in one secure location with easy access and management."
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-600" />,
    title: "Advanced Security",
    description: "HIPAA-compliant data protection with end-to-end encryption for all medical records."
  },
  {
    icon: <Clock className="h-8 w-8 text-blue-600" />,
    title: "Real-time Updates",
    description: "Instant synchronization across all devices ensures your data is always current."
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Team Collaboration",
    description: "Seamless coordination between healthcare providers for better patient care."
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Fast Performance",
    description: "Lightning-fast access to medical records when you need them most."
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Global Access",
    description: "Access your medical information securely from anywhere in the world."
  },
  {
    icon: <Lock className="h-8 w-8 text-blue-600" />,
    title: "Privacy Controls",
    description: "Granular permission settings to control who can access your medical data."
  },
  {
    icon: <FileText className="h-8 w-8 text-blue-600" />,
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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-3">
          Welcome to MedChainX
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The next generation healthcare management platform designed for patients, doctors, and hospitals
        </p>
      </div>
      
      <div className="relative h-[400px] overflow-hidden rounded-xl shadow-lg">
        <div 
          className="transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        >
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`absolute inset-0 border-0 bg-white dark:bg-gray-800 transition-opacity duration-500 ${
                index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-6 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
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
    </div>
  );
} 