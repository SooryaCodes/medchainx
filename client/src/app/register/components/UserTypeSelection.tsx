import { UserIcon, Building2Icon, StethoscopeIcon } from "lucide-react";

type UserTypeSelectionProps = {
  onSelect: (type: "patient" | "hospital" | "doctor") => void;
};

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Join MedChainX
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
          Select your account type to get started with our advanced healthcare management system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          {
            type: "patient",
            title: "Patient",
            icon: <UserIcon className="w-10 h-10 text-blue-600" />,
            description: "Create your personal health profile and manage your medical records securely"
          },
          {
            type: "hospital",
            title: "Hospital",
            icon: <Building2Icon className="w-10 h-10 text-blue-600" />,
            description: "Register your healthcare facility and manage your medical staff efficiently"
          },
          {
            type: "doctor",
            title: "Doctor",
            icon: <StethoscopeIcon className="w-10 h-10 text-blue-600" />,
            description: "Join as a medical professional and connect with hospitals and patients"
          }
        ].map((item) => (
          <div
            key={item.type}
            className="group cursor-pointer relative overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl rounded-xl"
            onClick={() => onSelect(item.type as "patient" | "hospital" | "doctor")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 group-hover:from-blue-600/10 group-hover:to-indigo-600/10 transition-all duration-300"></div>
            <div className="p-8 text-center space-y-4 relative z-10">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
            <div className="h-1 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 