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
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "Comprehensive Records",
    description: "Store complete patient histories in one secure location with easy access and management."
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Advanced Security",
    description: "HIPAA-compliant data protection with end-to-end encryption for all medical records."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Real-time Updates",
    description: "Instant synchronization across all devices ensures your data is always current."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Team Collaboration",
    description: "Seamless coordination between healthcare providers for better patient care."
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Fast Performance",
    description: "Lightning-fast access to medical records when you need them most."
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Global Access",
    description: "Access your medical information securely from anywhere in the world."
  },
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: "Privacy Controls",
    description: "Granular permission settings to control who can access your medical data."
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Welcome to MedChainX
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The next generation healthcare management platform designed for patients, doctors, and hospitals
        </p>
      </div>
      
      <div className="relative h-[400px] overflow-hidden rounded-2xl">
        <div 
          className="transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        >
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`absolute inset-0 border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm dark:from-gray-800/90 dark:to-gray-800/70 transition-opacity duration-500 ${
                index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-6 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-4">{feature.title}</h3>
                <p className="text-muted-foreground max-w-md">{feature.description}</p>
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
                ? "bg-primary w-6" 
                : "bg-gray-300 dark:bg-gray-700"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
} 