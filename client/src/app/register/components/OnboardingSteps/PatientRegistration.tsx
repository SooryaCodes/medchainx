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
    // Authentication Info
    username: "",
    password: "",
    confirm_password: "",
    
    // Personal Info (matches schema)
    name: {
      given: [""], // First name will be stored here
      family: "",  // Last name
    },
    birthDate: "",
    gender: "",
    
    // Contact Info
    contact: {
      phone: "",
      email: "",
    },
    
    // Address (will be stored in user profile)
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    
    // Emergency Contact
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "", // Additional field for relationship
    },
    
    // Additional fields for registration
    bloodType: "",
    healthInsuranceId: "",
    nationalId: "",
  });

  type FormDataKeys = keyof typeof formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        // Create a safe copy with proper typing
        const parentObj = (prev[parent as FormDataKeys] && 
                           typeof prev[parent as FormDataKeys] === 'object' && 
                           prev[parent as FormDataKeys] !== null) 
                           ? {...prev[parent as FormDataKeys] as Record<string, any>} 
                           : {};
        
        return {
          ...prev,
          [parent as FormDataKeys]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name as FormDataKeys]: value }));
    }
  };

  const handleGivenNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: {
        ...prev.name,
        given: [value]
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="space-y-2">
          <Label htmlFor="given_name">First Name</Label>
          <Input 
            id="given_name" 
            name="given_name" 
            value={formData.name.given[0]} 
            onChange={(e) => handleGivenNameChange(e.target.value)} 
            placeholder="Enter your first name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="family">Last Name</Label>
          <Input 
            id="family" 
            name="name.family" 
            value={formData.name.family} 
            onChange={handleChange} 
            placeholder="Enter your last name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date of Birth</Label>
          <Input 
            id="birthDate" 
            name="birthDate" 
            type="date" 
            value={formData.birthDate} 
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
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="contact.email" 
            type="email" 
            value={formData.contact.email} 
            onChange={handleChange} 
            placeholder="Enter your email"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="contact.phone" 
            value={formData.contact.phone} 
            onChange={handleChange} 
            placeholder="Enter your phone number"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street">Street Address</Label>
          <Textarea 
            id="street" 
            name="address.street" 
            value={formData.address.street} 
            onChange={handleChange} 
            placeholder="Enter your street address"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            name="address.city" 
            value={formData.address.city} 
            onChange={handleChange} 
            placeholder="Enter your city"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input 
            id="state" 
            name="address.state" 
            value={formData.address.state} 
            onChange={handleChange} 
            placeholder="Enter your state"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">ZIP/Postal Code</Label>
          <Input 
            id="postalCode" 
            name="address.postalCode" 
            value={formData.address.postalCode} 
            onChange={handleChange} 
            placeholder="Enter your ZIP code"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            name="address.country" 
            value={formData.address.country} 
            onChange={handleChange} 
            placeholder="Enter your country"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bloodType">Blood Type</Label>
          <Select onValueChange={(value) => handleSelectChange("bloodType", value)}>
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
          <Label htmlFor="healthInsuranceId">Health Insurance ID</Label>
          <Input 
            id="healthInsuranceId" 
            name="healthInsuranceId" 
            value={formData.healthInsuranceId} 
            onChange={handleChange} 
            placeholder="Enter your insurance ID"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalId">National ID</Label>
          <Input 
            id="nationalId" 
            name="nationalId" 
            value={formData.nationalId} 
            onChange={handleChange} 
            placeholder="Enter your national ID"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="emergencyName">Emergency Contact Name</Label>
          <Input 
            id="emergencyName" 
            name="emergencyContact.name" 
            value={formData.emergencyContact.name} 
            onChange={handleChange} 
            placeholder="Enter emergency contact name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyRelationship">Relationship</Label>
          <Input 
            id="emergencyRelationship" 
            name="emergencyContact.relationship" 
            value={formData.emergencyContact.relationship} 
            onChange={handleChange} 
            placeholder="Enter relationship"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Emergency Contact Number</Label>
          <Input 
            id="emergencyPhone" 
            name="emergencyContact.phone" 
            value={formData.emergencyContact.phone} 
            onChange={handleChange} 
            placeholder="Enter emergency contact number"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm dark:from-gray-900/80 dark:to-gray-800/60">
      <CardContent className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary">
            {step === 1 && "Account & Personal Information"}
            {step === 2 && "Contact Information"}
            {step === 3 && "Medical Information"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {step === 1 && "Create your account and provide your basic details"}
            {step === 2 && "How can we reach you?"}
            {step === 3 && "Important health information for your records"}
          </p>
        </div>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </CardContent>
    </Card>
  );
}