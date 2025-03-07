import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, Building2Icon, StethoscopeIcon } from "lucide-react";

type UserTypeSelectionProps = {
  onSelect: (type: "patient" | "hospital" | "doctor") => void;
};

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-3">Join MedChainX</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select your account type to get started with our advanced healthcare management system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer group relative overflow-hidden border-2 hover:border-primary transition-all"
          onClick={() => onSelect("patient")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-8 text-center space-y-4 relative z-10">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary">Patient</h3>
            <p className="text-sm text-muted-foreground">
              Create your personal health profile and manage your medical records securely
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer group relative overflow-hidden border-2 hover:border-primary transition-all"
          onClick={() => onSelect("hospital")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-8 text-center space-y-4 relative z-10">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Building2Icon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary">Hospital</h3>
            <p className="text-sm text-muted-foreground">
              Register your healthcare facility and manage your medical staff efficiently
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer group relative overflow-hidden border-2 hover:border-primary transition-all"
          onClick={() => onSelect("doctor")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-8 text-center space-y-4 relative z-10">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <StethoscopeIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary">Doctor</h3>
            <p className="text-sm text-muted-foreground">
              Join as a medical professional and connect with hospitals and patients
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 