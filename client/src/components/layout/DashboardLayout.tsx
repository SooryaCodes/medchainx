import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Shield, 
  Clock, 
  Users, 
  FileText, 
  BarChart4, 
  MessageSquare 
} from "lucide-react";

type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "Comprehensive Health Records",
    description: "Securely store and access complete patient medical histories in one place."
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Advanced Data Security",
    description: "Enterprise-grade encryption and compliance with HIPAA regulations."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Real-time Updates",
    description: "Instant synchronization across devices for up-to-date patient information."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Multi-user Collaboration",
    description: "Seamless coordination between doctors, staff, and healthcare providers."
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Smart Documentation",
    description: "AI-assisted note-taking and documentation to reduce administrative burden."
  },
  {
    icon: <BarChart4 className="h-8 w-8 text-primary" />,
    title: "Analytics Dashboard",
    description: "Powerful insights and reporting tools to improve patient care."
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Patient Communication",
    description: "Integrated messaging system for better doctor-patient engagement."
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex min-h-screen">
      {/* Feature Sidebar */}
      <div className="hidden lg:flex w-1/3 bg-gradient-to-br from-primary/90 to-accent/90 text-white p-8 flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">MedChainX</h1>
          <p className="text-white/80 mt-2">Next-Generation EMR Solution</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="glass-container p-6 text-foreground">
            {features[activeFeature].icon}
            <h2 className="text-xl font-semibold mt-4 text-primary-foreground">
              {features[activeFeature].title}
            </h2>
            <p className="mt-2 text-primary-foreground/80">
              {features[activeFeature].description}
            </p>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeFeature ? "bg-white w-6" : "bg-white/50"
                }`}
                onClick={() => setActiveFeature(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-8 border-t border-white/20">
          <p className="text-sm text-white/70">
            © 2023 MedChainX. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
} 