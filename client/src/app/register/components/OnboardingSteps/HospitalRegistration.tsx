import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

type HospitalRegistrationProps = {
  step: number;
  setStep: (step: number) => void;
};

export default function HospitalRegistration({ step, setStep }: HospitalRegistrationProps) {
  const [formData, setFormData] = useState({
    // Authentication Info
    username: "",
    password: "",
    confirm_password: "",
    
    // Hospital Info
    name: "",
    registration_number: "",
    type: "",
    total_beds: "",
    available_beds: "",
    
    // Contact
    email: "",
    contact_number: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    
    // Departments
    departments: [""],
    
    // Doctors (will be handled separately)
  });

  const [doctors, setDoctors] = useState([{
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    license_number: "",
  }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (index: number, value: string) => {
    const updatedDepartments = [...formData.departments];
    updatedDepartments[index] = value;
    setFormData(prev => ({ ...prev, departments: updatedDepartments }));
  };

  const addDepartment = () => {
    setFormData(prev => ({ 
      ...prev, 
      departments: [...prev.departments, ""] 
    }));
  };

  const removeDepartment = (index: number) => {
    const updatedDepartments = [...formData.departments];
    updatedDepartments.splice(index, 1);
    setFormData(prev => ({ ...prev, departments: updatedDepartments }));
  };

  const handleDoctorChange = (index: number, field: string, value: string) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[index] = { ...updatedDoctors[index], [field]: value };
    setDoctors(updatedDoctors);
  };

  const addDoctor = () => {
    setDoctors([...doctors, {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      license_number: "",
    }]);
  };

  const removeDoctor = (index: number) => {
    const updatedDoctors = [...doctors];
    updatedDoctors.splice(index, 1);
    setDoctors(updatedDoctors);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="username">Admin Username</Label>
          <Input 
            id="username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            placeholder="Choose an admin username"
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
      
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-8">Hospital Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Hospital Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter hospital name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registration_number">Registration Number</Label>
          <Input 
            id="registration_number" 
            name="registration_number" 
            value={formData.registration_number} 
            onChange={handleChange} 
            placeholder="Enter registration number"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Hospital Type</Label>
          <Select onValueChange={(value) => handleSelectChange("type", value)}>
            <SelectTrigger className="border-blue-200">
              <SelectValue placeholder="Select hospital type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Clinic">Clinic</SelectItem>
              <SelectItem value="Specialty">Specialty</SelectItem>
              <SelectItem value="Research Center">Research Center</SelectItem>
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
            placeholder="Enter hospital email"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input 
            id="contact_number" 
            name="contact_number" 
            value={formData.contact_number} 
            onChange={handleChange} 
            placeholder="Enter contact number"
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
            placeholder="Enter street address"
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
            placeholder="Enter city"
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
            placeholder="Enter state"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Facility Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="total_beds">Total Beds</Label>
          <Input 
            id="total_beds" 
            name="total_beds" 
            type="number" 
            value={formData.total_beds} 
            onChange={handleChange} 
            placeholder="Enter total beds"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="available_beds">Available Beds</Label>
          <Input 
            id="available_beds" 
            name="available_beds" 
            type="number" 
            value={formData.available_beds} 
            onChange={handleChange} 
            placeholder="Enter available beds"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label>Departments</Label>
          {formData.departments.map((department, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <Input 
                value={department} 
                onChange={(e) => handleDepartmentChange(index, e.target.value)} 
                placeholder="Enter department name"
                className="border-blue-200 focus:border-blue-400"
              />
              {formData.departments.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeDepartment(index)}
                  className="text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addDepartment}
            className="mt-2 text-blue-600 border-blue-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Department
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Medical Staff</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Add key doctors to your hospital profile</p>
      
      {doctors.map((doctor, index) => (
        <Card key={index} className="border-blue-100 dark:border-blue-900 mt-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Doctor {index + 1}</h3>
              {doctors.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeDoctor(index)}
                  className="text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  value={doctor.first_name} 
                  onChange={(e) => handleDoctorChange(index, "first_name", e.target.value)} 
                  placeholder="Enter first name"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  value={doctor.last_name} 
                  onChange={(e) => handleDoctorChange(index, "last_name", e.target.value)} 
                  placeholder="Enter last name"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input 
                  value={doctor.specialization} 
                  onChange={(e) => handleDoctorChange(index, "specialization", e.target.value)} 
                  placeholder="Enter specialization"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label>License Number</Label>
                <Input 
                  value={doctor.license_number} 
                  onChange={(e) => handleDoctorChange(index, "license_number", e.target.value)} 
                  placeholder="Enter license number"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={addDoctor}
        className="mt-2 text-blue-600 border-blue-200"
      >
        <PlusCircle className="h-4 w-4 mr-2" /> Add Another Doctor
      </Button>
    </div>
  );

  return (
    <Card className="border-blue-100 dark:border-blue-900">
      <CardContent className="p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </CardContent>
    </Card>
  );
}