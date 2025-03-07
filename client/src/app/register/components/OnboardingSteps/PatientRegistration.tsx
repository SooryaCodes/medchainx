import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type PatientRegistrationProps = {
  step: number;
  setStep: (step: number) => void;
};

export default function PatientRegistration({ step, setStep }: PatientRegistrationProps) {
  const [formData, setFormData] = useState({
    // Personal Info
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_type: "",
    contact_number: "",
    email: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    
    // Identification
    national_id: "",
    health_insurance_id: "",
    
    // Emergency Contact
    emergency_name: "",
    emergency_relation: "",
    emergency_contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Personal Information</h2>
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
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input 
            id="date_of_birth" 
            name="date_of_birth" 
            type="date" 
            value={formData.date_of_birth} 
            onChange={handleChange}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => handleSelectChange("gender", value)}>
            <SelectTrigger className="border-blue-200">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="contact_number">Phone Number</Label>
          <Input 
            id="contact_number" 
            name="contact_number" 
            value={formData.contact_number} 
            onChange={handleChange} 
            placeholder="Enter your phone number"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street">Street Address</Label>
          <Textarea 
            id="street" 
            name="street" 
            value={formData.street} 
            onChange={handleChange} 
            placeholder="Enter your street address"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            placeholder="Enter your city"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input 
            id="state" 
            name="state" 
            value={formData.state} 
            onChange={handleChange} 
            placeholder="Enter your state"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Medical Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="blood_type">Blood Type</Label>
          <Select onValueChange={(value) => handleSelectChange("blood_type", value)}>
            <SelectTrigger className="border-blue-200">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="health_insurance_id">Health Insurance ID</Label>
          <Input 
            id="health_insurance_id" 
            name="health_insurance_id" 
            value={formData.health_insurance_id} 
            onChange={handleChange} 
            placeholder="Enter your insurance ID"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="emergency_name">Emergency Contact Name</Label>
          <Input 
            id="emergency_name" 
            name="emergency_name" 
            value={formData.emergency_name} 
            onChange={handleChange} 
            placeholder="Enter emergency contact name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_relation">Relationship</Label>
          <Input 
            id="emergency_relation" 
            name="emergency_relation" 
            value={formData.emergency_relation} 
            onChange={handleChange} 
            placeholder="Enter relationship"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact">Emergency Contact Number</Label>
          <Input 
            id="emergency_contact" 
            name="emergency_contact" 
            value={formData.emergency_contact} 
            onChange={handleChange} 
            placeholder="Enter emergency contact number"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
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