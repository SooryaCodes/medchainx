import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Clock, Shield, Building2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

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
    website: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    
    // Departments
    departments: [""],
    
    // Services
    services: [""],
    emergencyServices: false,
    telemedicineAvailable: false,
    
    // Certifications
    certifications: [""],
    
    // Billing Info
    acceptedInsurances: [""],
    paymentMethods: ["Credit Card", "Insurance", "Cash"],
    
    // Operating Hours
    operatingHours: [
      { day: "Monday", openTime: "09:00", closeTime: "17:00" },
      { day: "Tuesday", openTime: "09:00", closeTime: "17:00" },
      { day: "Wednesday", openTime: "09:00", closeTime: "17:00" },
      { day: "Thursday", openTime: "09:00", closeTime: "17:00" },
      { day: "Friday", openTime: "09:00", closeTime: "17:00" },
      { day: "Saturday", openTime: "", closeTime: "" },
      { day: "Sunday", openTime: "", closeTime: "" },
    ],
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
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

  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = value;
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    setFormData(prev => ({ 
      ...prev, 
      services: [...prev.services, ""] 
    }));
  };

  const removeService = (index: number) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleCertificationChange = (index: number, value: string) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = value;
    setFormData(prev => ({ ...prev, certifications: updatedCertifications }));
  };

  const addCertification = () => {
    setFormData(prev => ({ 
      ...prev, 
      certifications: [...prev.certifications, ""] 
    }));
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData(prev => ({ ...prev, certifications: updatedCertifications }));
  };

  const handleInsuranceChange = (index: number, value: string) => {
    const updatedInsurances = [...formData.acceptedInsurances];
    updatedInsurances[index] = value;
    setFormData(prev => ({ ...prev, acceptedInsurances: updatedInsurances }));
  };

  const addInsurance = () => {
    setFormData(prev => ({ 
      ...prev, 
      acceptedInsurances: [...prev.acceptedInsurances, ""] 
    }));
  };

  const removeInsurance = (index: number) => {
    const updatedInsurances = [...formData.acceptedInsurances];
    updatedInsurances.splice(index, 1);
    setFormData(prev => ({ ...prev, acceptedInsurances: updatedInsurances }));
  };

  const handleOperatingHourChange = (index: number, field: "openTime" | "closeTime", value: string) => {
    const updatedHours = [...formData.operatingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData(prev => ({ ...prev, operatingHours: updatedHours }));
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
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Account Information</h2>
      </div>
      
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
      
      <div className="flex items-center gap-3 mt-8 mb-4">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Hospital Information</h2>
      </div>
      
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
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Contact Information</h2>
      </div>
      
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
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            placeholder="Enter hospital website"
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
        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input 
            id="zip_code" 
            name="zip_code" 
            value={formData.zip_code} 
            onChange={handleChange} 
            placeholder="Enter ZIP code"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            name="country" 
            value={formData.country} 
            onChange={handleChange} 
            placeholder="Enter country"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Facility Information</h2>
      </div>
      
      <Tabs defaultValue="capacity" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="capacity" className="space-y-4">
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
          </div>
          
          <div className="space-y-2 mt-6">
            <h3 className="text-md font-medium">Operating Hours</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2 mb-2 text-sm font-medium">
                <div>Day</div>
                <div>Open Time</div>
                <div>Close Time</div>
              </div>
              {formData.operatingHours.map((hour, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <div className="flex items-center">{hour.day}</div>
                  <Input 
                    type="time" 
                    value={hour.openTime} 
                    onChange={(e) => handleOperatingHourChange(index, "openTime", e.target.value)} 
                    className="border-blue-200 focus:border-blue-400"
                  />
                  <Input 
                    type="time" 
                    value={hour.closeTime} 
                    onChange={(e) => handleOperatingHourChange(index, "closeTime", e.target.value)} 
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-4">
          <div className="space-y-2">
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
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <div className="space-y-2">
            <Label>Services Offered</Label>
            {formData.services.map((service, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input 
                  value={service} 
                  onChange={(e) => handleServiceChange(index, e.target.value)} 
                  placeholder="Enter service name"
                  className="border-blue-200 focus:border-blue-400"
                />
                {formData.services.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeService(index)}
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
              onClick={addService}
              className="mt-2 text-blue-600 border-blue-200"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Service
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">Emergency Services</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Offer 24/7 emergency care</p>
              </div>
              <Switch 
                checked={formData.emergencyServices} 
                onCheckedChange={(checked) => handleSwitchChange("emergencyServices", checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">Telemedicine</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Offer virtual consultations</p>
              </div>
              <Switch 
                checked={formData.telemedicineAvailable} 
                onCheckedChange={(checked) => handleSwitchChange("telemedicineAvailable", checked)} 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <Tabs defaultValue="doctors" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="doctors">Medical Staff</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="billing">Billing Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="doctors" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Medical Staff</h2>
          </div>
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
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      value={doctor.email} 
                      onChange={(e) => handleDoctorChange(index, "email", e.target.value)} 
                      placeholder="Enter email"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input 
                      value={doctor.experience} 
                      onChange={(e) => handleDoctorChange(index, "experience", e.target.value)} 
                      placeholder="Enter years of experience"
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
        </TabsContent>
        
        <TabsContent value="certifications" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Certifications & Accreditations</h2>
          </div>
          
          <div className="space-y-2">
            {formData.certifications.map((certification, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input 
                  value={certification} 
                  onChange={(e) => handleCertificationChange(index, e.target.value)} 
                  placeholder="Enter certification or accreditation"
                  className="border-blue-200 focus:border-blue-400"
                />
                {formData.certifications.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeCertification(index)}
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
              onClick={addCertification}
              className="mt-2 text-blue-600 border-blue-200"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Certification
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Billing Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Accepted Insurance Providers</Label>
              {formData.acceptedInsurances.map((insurance, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input 
                    value={insurance} 
                    onChange={(e) => handleInsuranceChange(index, e.target.value)} 
                    placeholder="Enter insurance provider"
                    className="border-blue-200 focus:border-blue-400"
                  />
                  {formData.acceptedInsurances.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeInsurance(index)}
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
                onClick={addInsurance}
                className="mt-2 text-blue-600 border-blue-200"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Insurance
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
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