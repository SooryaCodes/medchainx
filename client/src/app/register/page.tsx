"use client";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UserTypeSelection from "./components/UserTypeSelection";
import PatientRegistration from "./components/OnboardingSteps/PatientRegistration";
import DoctorRegistration from "./components/OnboardingSteps/DoctorRegistration";
import HospitalRegistration from "./components/OnboardingSteps/HospitalRegistration";
import AppFeatures from "./components/AppFeatures";
import RegistrationHeader from "./components/RegistrationHeader";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950">
      <RegistrationHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - App Features */}
          <div className="hidden lg:block">
            <AppFeatures />
          </div>
          
          {/* Right Column - Registration Form */}
          <div className="w-full max-w-2xl mx-auto lg:mx-0">
            {!userType ? (
              <UserTypeSelection onSelect={handleUserTypeSelect} />
            ) : (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {userType === "patient" && "Patient Registration"}
                      {userType === "doctor" && "Doctor Registration"}
                      {userType === "hospital" && "Hospital Registration"}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Step {step} of {maxSteps}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300 rounded-full"
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
                
                <div className="flex justify-between mt-8">
                  <Button 
                    onClick={handleBack} 
                    variant="outline"
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {step === 1 ? "Change Type" : "Previous"}
                  </Button>
                  
                  <Button 
                    onClick={step === maxSteps ? handleSubmit : handleNext}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
    </div>
  );
}
