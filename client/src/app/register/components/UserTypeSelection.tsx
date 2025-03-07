import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, Building2Icon, StethoscopeIcon } from "lucide-react";

type UserTypeSelectionProps = {
  onSelect: (type: "patient" | "hospital" | "doctor") => void;
};

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        className="cursor-pointer hover:border-blue-400 transition-all"
        onClick={() => onSelect("patient")}
      >
        <CardContent className="p-6 text-center space-y-4">
          <UserIcon className="w-12 h-12 mx-auto text-blue-600" />
          <h3 className="text-xl font-semibold">Patient</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Create your personal health profile and manage your medical records
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:border-blue-400 transition-all"
        onClick={() => onSelect("hospital")}
      >
        <CardContent className="p-6 text-center space-y-4">
          <Building2Icon className="w-12 h-12 mx-auto text-blue-600" />
          <h3 className="text-xl font-semibold">Hospital</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Register your healthcare facility and manage your medical staff
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:border-blue-400 transition-all"
        onClick={() => onSelect("doctor")}
      >
        <CardContent className="p-6 text-center space-y-4">
          <StethoscopeIcon className="w-12 h-12 mx-auto text-blue-600" />
          <h3 className="text-xl font-semibold">Doctor</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Join as a medical professional and connect with hospitals
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 