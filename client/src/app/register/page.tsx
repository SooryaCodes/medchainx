"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UserTypeSelection from "./components/UserTypeSelection";
import PatientRegistration from "./components/OnboardingSteps/PatientRegistration";
import HospitalRegistration from "./components/OnboardingSteps/HospitalRegistration";
import DoctorRegistration from "./components/OnboardingSteps/DoctorRegistration";

type UserType = "patient" | "hospital" | "doctor" | null;

export default function Register() {
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState(1);
  const totalSteps = userType === "hospital" ? 4 : 3;
  const progress = (step / totalSteps) * 100;

  const renderStep = () => {
    if (!userType) {
      return <UserTypeSelection onSelect={setUserType} />;
    }

    switch (userType) {
      case "patient":
        return <PatientRegistration step={step} setStep={setStep} />;
      case "hospital":
        return <HospitalRegistration step={step} setStep={setStep} />;
      case "doctor":
        return <DoctorRegistration step={step} setStep={setStep} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-blue-100 p-4 sm:p-8">
      <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold text-center">App Features</h2>
        <ul className="mt-4 space-y-2">
          <li>✅ Secure Patient Record Management</li>
          <li>✅ Role-Based Access Control</li>
          <li>✅ Real-Time Data Sync</li>
          <li>✅ User-Friendly Dashboard</li>
          <li>✅ Automated Notifications</li>
        </ul>
      </div>
      <div className="w-3/4 mx-auto">
        <Card className="shadow-xl border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  Welcome to MedChainX
                </h1>
                <p className="text-blue-600 dark:text-blue-300 mt-2">
                  Let's get you started with your registration
                </p>
              </div>

              <Progress value={progress} className="h-2 bg-blue-100" />

              <div className="mt-8">{renderStep()}</div>

              {userType && (
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => step > 1 ? setStep(step - 1) : setUserType(null)}
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    Back
                  </Button>
                  {step < totalSteps && (
                    <Button
                      onClick={() => setStep(step + 1)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
