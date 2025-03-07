"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UserTypeSelection from "./components/UserTypeSelection";
import PatientRegistration from "./components/OnboardingSteps/PatientRegistration";
import DoctorRegistration from "./components/OnboardingSteps/DoctorRegistration";
import HospitalRegistration from "./components/OnboardingSteps/HospitalRegistration";
import RegistrationHeader from "./components/RegistrationHeader";
import AppFeatures from "./components/AppFeatures";

export default function RegisterPage() {
  const [userType, setUserType] = useState<"patient" | "hospital" | "doctor" | null>(null);
  const [step, setStep] = useState(1);
  const maxSteps = userType === "hospital" ? 4 : 3;

  const handleUserTypeSelect = (type: "patient" | "hospital" | "doctor") => {
    setUserType(type);
    setStep(1);
  };

  const handleNext = () => {
    if (step < maxSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setUserType(null);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
    // Redirect to success page or dashboard
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Blue Section with Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-blue-600 flex-col p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="relative z-10">
          <h1 className="text-white text-4xl font-bold mb-4">MedChainX</h1>
          <p className="text-blue-100 text-lg mb-12">Next-Generation Healthcare Platform</p>
          
          <div className="mt-12">
            <h2 className="text-white text-5xl font-bold leading-tight mb-6">
              Start your healthcare journey with us.
            </h2>
            <p className="text-blue-100 text-xl mb-8">
              Discover the world's most advanced EMR solution for patients, doctors, and hospitals.
            </p>
            <div className="hidden md:block md:col-span-2">
                <AppFeatures />
              </div>
          
          </div>
        </div>
        
      
      </div>
      
      {/* Right Column - Registration Form */}
      <div className="w-full lg:w-3/5 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <RegistrationHeader />
        
        <div className="max-w-2xl mx-auto px-6 py-12">
          {!userType ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <UserTypeSelection onSelect={handleUserTypeSelect} />
              </div>
            
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-900/30">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userType === "patient" && "Patient Registration"}
                    {userType === "doctor" && "Doctor Registration"}
                    {userType === "hospital" && "Hospital Registration"}
                  </h2>
                  <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    Step {step} of {maxSteps}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
                    style={{ width: `${(step / maxSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {userType === "patient" && (
                <PatientRegistration step={step} setStep={setStep} />
              )}
              
              {userType === "doctor" && (
                <DoctorRegistration step={step} setStep={setStep} />
              )}
              
              {userType === "hospital" && (
                <HospitalRegistration step={step} setStep={setStep} />
              )}
              
              <div className="flex justify-between mt-12">
                <Button 
                  onClick={handleBack} 
                  variant="outline"
                  className="gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {step === 1 ? "Change Type" : "Previous"}
                </Button>
                
                <Button 
                  onClick={step === maxSteps ? handleSubmit : handleNext}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {step === maxSteps ? "Complete Registration" : "Continue"}
                  {step !== maxSteps && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
