import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type DoctorRegistrationProps = {
  step: number;
  setStep: (step: number) => void;
};

export default function DoctorRegistration({ step, setStep }: DoctorRegistrationProps) {
  const [formData, setFormData] = useState({
    // Authentication Info
    username: "",
    password: "",
    confirm_password: "",
    
    // Personal Info
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    
    // Professional Info
    specialization: "",
    experience: "",
    license_number: "",
    
    // Hospital Affiliation
    hospital_id: "",
    
    // Schedule
    available_hours: [
      { day: "Monday", start_time: "", end_time: "", enabled: true },
      { day: "Tuesday", start_time: "", end_time: "", enabled: true },
      { day: "Wednesday", start_time: "", end_time: "", enabled: true },
      { day: "Thursday", start_time: "", end_time: "", enabled: true },
      { day: "Friday", start_time: "", end_time: "", enabled: true },
      { day: "Saturday", start_time: "", end_time: "", enabled: false },
      { day: "Sunday", start_time: "", end_time: "", enabled: false },
    ],
  });

  // Mock hospital data (in a real app, this would come from an API)
  const hospitals = [
    { id: "1", name: "General Hospital" },
    { id: "2", name: "City Medical Center" },
    { id: "3", name: "University Hospital" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index: number, field: "start_time" | "end_time", value: string) => {
    const updatedHours = [...formData.available_hours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData(prev => ({ ...prev, available_hours: updatedHours }));
  };

  const toggleDayEnabled = (index: number) => {
    const updatedHours = [...formData.available_hours];
    updatedHours[index] = { 
      ...updatedHours[index], 
      enabled: !updatedHours[index].enabled,
      start_time: !updatedHours[index].enabled ? updatedHours[index].start_time : "",
      end_time: !updatedHours[index].enabled ? updatedHours[index].end_time : "",
    };
    setFormData(prev => ({ ...prev, available_hours: updatedHours }));
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            placeholder="Choose a username"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password"
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Create a password"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input 
            id="confirm_password" 
            name="confirm_password" 
            type="password"
            value={formData.confirm_password} 
            onChange={handleChange} 
            placeholder="Confirm your password"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-8">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            value={formData.first_name} 
            onChange={handleChange} 
            placeholder="Enter your first name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            value={formData.last_name} 
            onChange={handleChange} 
            placeholder="Enter your last name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter your email"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Enter your phone number"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Professional Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input 
            id="specialization" 
            name="specialization" 
            value={formData.specialization} 
            onChange={handleChange} 
            placeholder="Enter your specialization"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input 
            id="experience" 
            name="experience" 
            type="number" 
            value={formData.experience} 
            onChange={handleChange} 
            placeholder="Enter years of experience"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="license_number">Medical License Number</Label>
          <Input 
            id="license_number" 
            name="license_number" 
            value={formData.license_number} 
            onChange={handleChange} 
            placeholder="Enter your license number"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="hospital_id">Hospital Affiliation</Label>
          <Select onValueChange={(value) => handleSelectChange("hospital_id", value)}>
            <SelectTrigger className="border-blue-200">
              <SelectValue placeholder="Select hospital" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((hospital) => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Schedule</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Select the days and times when you are available</p>
      
      {formData.available_hours.map((hour, index) => (
        <div key={index} className="flex items-center gap-2 mt-2">
          <Checkbox 
            checked={hour.enabled} 
            onCheckedChange={(checked) => toggleDayEnabled(index)}
          />
          <span>{hour.day}</span>
          <Input 
            value={hour.start_time} 
            onChange={(e) => handleScheduleChange(index, "start_time", e.target.value)} 
            placeholder="Start time"
            className="border-blue-200 focus:border-blue-400"
          />
          <Input 
            value={hour.end_time} 
            onChange={(e) => handleScheduleChange(index, "end_time", e.target.value)} 
            placeholder="End time"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-blue-100 dark:border-blue-900">
      <CardContent className="p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </CardContent>
    </Card>
  );
} 