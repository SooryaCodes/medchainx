import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, Building2Icon, StethoscopeIcon } from "lucide-react";

type UserTypeSelectionProps = {
  onSelect: (type: "patient" | "hospital" | "doctor") => void;
};

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-blue-600 mb-3">Join MedChainX</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Select your account type to get started with our advanced healthcare management system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer relative overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-xl"
          onClick={() => onSelect("patient")}
        >
          <CardContent className="p-8 text-center space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Patient</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create your personal health profile and manage your medical records securely
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer relative overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-xl"
          onClick={() => onSelect("hospital")}
        >
          <CardContent className="p-8 text-center space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
              <Building2Icon className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Hospital</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Register your healthcare facility and manage your medical staff efficiently
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer relative overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-xl"
          onClick={() => onSelect("doctor")}
        >
          <CardContent className="p-8 text-center space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
              <StethoscopeIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Doctor</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join as a medical professional and connect with hospitals and patients
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 