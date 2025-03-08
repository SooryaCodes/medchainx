import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, UserIcon, Stethoscope, Clock, Building2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { setAuthCookies } from "@/lib/cookies";
import { DoctorRegistrationData, RegistrationResponse } from "@/types/auth";
import toast from "react-hot-toast";

type DoctorRegistrationProps = {
  step: number;
  setStep: (step: number) => void;
  handleNext: () => void;
  handleBack: () => void;
};

export default function DoctorRegistration({ step, setStep }: DoctorRegistrationProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Authentication Info
    username: "",
    password: "",
    confirm_password: "",
    
    // Personal Info
    given_name: "",
    family_name: "",
    email: "",
    phone: "",
    
    // Professional Info
    specialty: "",
    years_of_experience: "",
    license_number: "",
    consultation_fee: "",
    telemedicine_available: false,
    
    // Hospital Affiliation
    hospital_id: "",
    
    // Languages
    languages_spoken: ["English"],
    
    // Schedule
    available_timings: [
      { day: "Monday", startTime: "", endTime: "", enabled: true },
      { day: "Tuesday", startTime: "", endTime: "", enabled: true },
      { day: "Wednesday", startTime: "", endTime: "", enabled: true },
      { day: "Thursday", startTime: "", endTime: "", enabled: true },
      { day: "Friday", startTime: "", endTime: "", enabled: true },
      { day: "Saturday", startTime: "", endTime: "", enabled: false },
      { day: "Sunday", startTime: "", endTime: "", enabled: false },
    ],
  });

  // Replace mock hospital data with state
  const [hospitals, setHospitals] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch hospitals data on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/hospitals');
        console.log(response.data, "response.data hospitals");
        
        // Transform the data to ensure it has the correct structure
        let hospitalData = Array.isArray(response.data) ? response.data : 
                          (response.data.hospitals || response.data.data || []);
        
        // Ensure each hospital has id and name properties
        hospitalData = hospitalData.map((hospital: any) => ({
          id: hospital.id || hospital._id || hospital.hospitalId || '',
          name: hospital.name || hospital.hospitalName || ''
        }));
        
        setHospitals(hospitalData);
      } catch (err) {
        console.error('Failed to fetch hospitals:', err);
        setError('Failed to load hospitals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHospitals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index: number, field: "startTime" | "endTime", value: string) => {
    const updatedHours = [...formData.available_timings];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData(prev => ({ ...prev, available_timings: updatedHours }));
  };

  const toggleDayEnabled = (index: number) => {
    const updatedHours = [...formData.available_timings];
    updatedHours[index] = { 
      ...updatedHours[index], 
      enabled: !updatedHours[index].enabled,
      startTime: !updatedHours[index].enabled ? updatedHours[index].startTime : "",
      endTime: !updatedHours[index].enabled ? updatedHours[index].endTime : "",
    };
    setFormData(prev => ({ ...prev, available_timings: updatedHours }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleLanguageChange = (index: number, value: string) => {
    const updatedLanguages = [...formData.languages_spoken];
    updatedLanguages[index] = value;
    setFormData(prev => ({ ...prev, languages_spoken: updatedLanguages }));
  };

  const addLanguage = () => {
    setFormData(prev => ({ 
      ...prev, 
      languages_spoken: [...prev.languages_spoken, ""] 
    }));
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = [...formData.languages_spoken];
    updatedLanguages.splice(index, 1);
    setFormData(prev => ({ ...prev, languages_spoken: updatedLanguages }));
  };

  // Add validation functions for each step
  const validateStep1 = async () => {
    // Validate username, password, confirm_password
    if (!formData.username || formData.username.length < 4) {
      setError("Username must be at least 4 characters");
      toast.error("Username must be at least 4 characters");
      return false;
    }
    
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return false;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      toast.error("Password must meet complexity requirements");
      return false;
    }
    
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return false;
    }
    
    setError("");
    setStep(2);
    return true;
  };
  
  const validateStep2 = async () => {
    // Validate personal and professional info
    if (!formData.given_name || formData.given_name.length < 2) {
      setError("First name must be at least 2 characters");
      toast.error("First name must be at least 2 characters");
      return false;
    }
    
    if (!formData.family_name || formData.family_name.length < 2) {
      setError("Last name must be at least 2 characters");
      toast.error("Last name must be at least 2 characters");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Invalid email address");
      toast.error("Invalid email address");
      return false;
    }
    
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      setError("Phone number must start with a '+' followed by 9 to 14 digits");
      toast.error("Invalid phone number format");
      return false;
    }
    
    if (!formData.specialty) {
      setError("Specialty is required");
      toast.error("Please select your specialty");
      return false;
    }
    
    if (!formData.years_of_experience) {
      setError("Years of experience is required");
      toast.error("Please enter your years of experience");
      return false;
    }
    
    if (!formData.license_number || formData.license_number.length < 5) {
      setError("Valid license number is required");
      toast.error("Please enter a valid license number");
      return false;
    }
    
    if (!formData.consultation_fee) {
      setError("Consultation fee is required");
      toast.error("Please enter your consultation fee");
      return false;
    }
    
    if (!formData.hospital_id) {
      setError("Hospital affiliation is required");
      toast.error("Please select your hospital affiliation");
      return false;
    }
    
    setError("");
    setStep(3);
    return true;
  };
  
  const validateStep3 = async () => {
    // Validate schedule
    let hasValidSchedule = false;
    
    for (const timing of formData.available_timings) {
      if (timing.enabled) {
        if (!timing.startTime || !timing.endTime) {
          setError("Please set both start and end times for enabled days");
          toast.error("Please set both start and end times for enabled days");
          return false;
        }
        
        if (timing.startTime >= timing.endTime) {
          setError("End time must be after start time");
          toast.error("End time must be after start time");
          return false;
        }
        
        hasValidSchedule = true;
      }
    }
    
    if (!hasValidSchedule) {
      setError("Please enable at least one day in your schedule");
      toast.error("Please enable at least one day in your schedule");
      return false;
    }
    
    setError("");
    return true;
  };
  
  const handleSubmit = async () => {
    const isValid = await validateStep3();
    if (!isValid) return;
    
    try {
      setIsLoading(true);
      setError("");
      
      // Format the data as needed
      const formattedData = {
        ...formData,
        phone: formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`,
        // Filter out disabled days or format as needed
        available_timings: formData.available_timings.filter(timing => timing.enabled)
      };
      
      const response = await axios.post<RegistrationResponse>('/doctor/register', formattedData);
      
      if (response.data.success) {
        const { doctorToken, doctorId } = response.data.data;
        setAuthCookies(doctorToken!, doctorId!, 'doctor');
        toast.success("Registration successful! You have been registered as a doctor.");
        router.push('/doctor/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Account Information</h2>
      </div>
      
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

      <div className="flex items-center gap-3 mt-8 mb-4">
        <UserIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Personal Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="given_name">First Name</Label>
          <Input 
            id="given_name" 
            name="given_name" 
            value={formData.given_name} 
            onChange={handleChange} 
            placeholder="Enter your first name"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="family_name">Last Name</Label>
          <Input 
            id="family_name" 
            name="family_name" 
            value={formData.family_name} 
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
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={validateStep1}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Stethoscope className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Professional Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialization</Label>
          <Input 
            id="specialty" 
            name="specialty" 
            value={formData.specialty} 
            onChange={handleChange} 
            placeholder="Enter your specialization"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="years_of_experience">Years of Experience</Label>
          <Input 
            id="years_of_experience" 
            name="years_of_experience" 
            type="number" 
            value={formData.years_of_experience} 
            onChange={handleChange} 
            placeholder="Enter years of experience"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label htmlFor="consultation_fee">Consultation Fee</Label>
          <Input 
            id="consultation_fee" 
            name="consultation_fee" 
            type="number"
            value={formData.consultation_fee} 
            onChange={handleChange} 
            placeholder="Enter your consultation fee"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="hospital_id">Hospital Affiliation</Label>
          <Select onValueChange={(value) => handleSelectChange("hospital_id", value)}>
            <SelectTrigger className="border-blue-200 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select hospital" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {hospitals.map((hospital) => (
                <SelectItem 
                  key={hospital.id} 
                  value={hospital.id}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg md:col-span-2">
          <div className="space-y-1">
            <h4 className="font-medium">Telemedicine</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Offer virtual consultations</p>
          </div>
          <Switch 
            checked={formData.telemedicine_available} 
            onCheckedChange={(checked) => handleSwitchChange("telemedicine_available", checked)} 
          />
        </div>
      </div>
      
      <div className="space-y-2 mt-6">
        <Label>Languages Spoken</Label>
        {formData.languages_spoken.map((language, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <Input 
              value={language} 
              onChange={(e) => handleLanguageChange(index, e.target.value)} 
              placeholder="Enter language"
              className="border-blue-200 focus:border-blue-400"
            />
            {formData.languages_spoken.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeLanguage(index)}
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
          onClick={addLanguage}
          className="mt-2 text-blue-600 border-blue-200"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Language
        </Button>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button 
          onClick={validateStep2}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Availability Schedule</h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">Set your regular working hours for patient appointments</p>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-medium">
          <div>Day</div>
          <div>Available</div>
          <div>Start Time</div>
          <div>End Time</div>
        </div>
        
        {formData.available_timings.map((timing, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-3 items-center">
            <div className="font-medium">{timing.day}</div>
            <div>
              <Checkbox 
                checked={timing.enabled} 
                onCheckedChange={() => toggleDayEnabled(index)}
              />
            </div>
            <Input 
              type="time" 
              value={timing.startTime} 
              onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)} 
              disabled={!timing.enabled}
              className="border-blue-200 focus:border-blue-400"
            />
            <Input 
              type="time" 
              value={timing.endTime} 
              onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)} 
              disabled={!timing.enabled}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Note: Your availability will be used to generate appointment slots for patients.</p>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => setStep(2)}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Registering..." : "Complete Registration"}
        </Button>
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