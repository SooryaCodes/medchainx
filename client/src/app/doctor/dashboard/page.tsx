"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  FileText, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  Search,
  Clock,
  Calendar,
  Stethoscope,
  Hospital,
  Languages,
  DollarSign,
  Video
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDoctor } from "@/context/DoctorContext";
import { useRouter } from "next/navigation";
import { accessPatientRecords, generateRecordsSummary } from "@/services/doctorService";
import { MedicalHistoryList } from "@/components/features/medical-history/MedicalHistoryList";
import { MedicalRecordDetail } from "@/components/features/medical-history/MedicalRecordDetail";

// Define interface for medical record
interface DashboardMedicalRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  doctor: {
    name: string;
    specialty: string;
    hospital: string;
    contact: string;
  };
  notes: string;
  prescriptions: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  labResults: Array<{
    name: string;
    result: string;
    referenceRange: string;
    date: string;
  }>;
  attachments: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  followUp: string;
  status: string;
  tags: string[];
}

export default function DoctorDashboard() {
  const { doctor, loading, error, logout } = useDoctor();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [accessToken, setAccessToken] = useState("");
  const [isAccessTokenValid, setIsAccessTokenValid] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [patientRecords, setPatientRecords] = useState<DashboardMedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DashboardMedicalRecord | null>(null);
  const [recordSummary, setRecordSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  
  // Handle access token submission
  const handleAccessPatientRecords = async () => {
    if (!accessToken) {
      setAccessError("Please enter an access token");
      return;
    }
    
    setIsLoading(true);
    setAccessError(null);
    
    try {
      const response = await accessPatientRecords(accessToken);
      
      if (response.success) {
        setPatientData(response.data.patient);
        setPatientRecords(response.data.records);
        setIsAccessTokenValid(true);
        
        // Generate summary
        const summaryResponse = await generateRecordsSummary(response.data.patient.id, accessToken);
        if (summaryResponse.success) {
          setRecordSummary(summaryResponse.data.summary);
        }
      } else {
        setAccessError(response.message || "Failed to access patient records");
      }
    } catch (err: any) {
      console.error("Error accessing patient records:", err);
      setAccessError(err.response?.data?.message || "Invalid or expired access token");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRecordSelect = (record: DashboardMedicalRecord) => {
    setSelectedRecord(record);
  };
  
  const handleCloseRecord = () => {
    setSelectedRecord(null);
  };
  
  const resetPatientAccess = () => {
    setIsAccessTokenValid(false);
    setPatientData(null);
    setPatientRecords([]);
    setSelectedRecord(null);
    setRecordSummary(null);
    setAccessToken("");
  };
  
  // Render doctor profile
  const renderProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Doctor Profile</CardTitle>
          <CardDescription>Your professional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {doctor && (
            <>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center">
                  <User size={40} className="text-gray-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    Dr. {doctor.name.given.join(' ')} {doctor.name.family}
                  </h3>
                  <p className="text-gray-500">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Hospital size={16} />
                    <span>{typeof doctor.hospitalId === 'object' ? doctor.hospitalId.name || 'Unknown Hospital' : doctor.hospitalId}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Stethoscope size={18} /> Professional Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Specialty</span>
                      <span>{doctor.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span>{doctor.yearsOfExperience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Consultation Fee</span>
                      <span className="flex items-center">
                        <DollarSign size={16} className="text-green-600" />
                        {doctor.consultationFee}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Telemedicine</span>
                      <span className="flex items-center gap-1">
                        {doctor.telemedicineAvailable ? (
                          <>
                            <Video size={16} className="text-green-600" />
                            Available
                          </>
                        ) : (
                          "Not available"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={18} /> Schedule
                  </h4>
                  <div className="space-y-2">
                    {doctor.availableTimings.map((timing, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-500">{timing.day}</span>
                        <span>{timing.startTime} - {timing.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <Languages size={18} /> Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.languagesSpoken.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="font-medium text-gray-700">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span>{doctor.contact.phone}</span>
                  </div>
                  {doctor.contact.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span>{doctor.contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {loading && <p className="text-center py-4">Loading profile information...</p>}
          
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              <p>{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  
  // Render patient consultation section
  const renderConsultation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Patient Consultation</CardTitle>
          <CardDescription>
            Enter the patient's access token to view their medical records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAccessTokenValid ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="accessToken" className="text-sm font-medium">
                  Patient Access Token
                </label>
                <Input
                  id="accessToken"
                  placeholder="Enter the access token provided by the patient"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                {accessError && (
                  <p className="text-sm text-red-600">{accessError}</p>
                )}
              </div>
              <Button 
                onClick={handleAccessPatientRecords} 
                disabled={isLoading || !accessToken}
                className="w-full"
              >
                {isLoading ? "Accessing..." : "Access Patient Records"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p>{patientData.name.given.join(' ')} {patientData.name.family}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p>{new Date(patientData.birthDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p>{patientData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Type</p>
                    <p>{patientData.bloodType}</p>
                  </div>
                </div>
              </div>
              
              {/* Medical Records Summary */}
              {recordSummary && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">AI-Generated Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{recordSummary}</p>
                  </CardContent>
                </Card>
              )}
              
              {/* Medical Records */}
              <div>
                <h3 className="font-medium text-lg mb-4">Medical Records</h3>
                {selectedRecord ? (
                  <MedicalRecordDetail 
                    record={selectedRecord} 
                    onClose={handleCloseRecord} 
                  />
                ) : (
                  <MedicalHistoryList 
                    records={patientRecords} 
                    onSelectRecord={handleRecordSelect} 
                  />
                )}
              </div>
              
              <Button variant="outline" onClick={resetPatientAccess} className="w-full">
                Finish Consultation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage your profile and patient consultations
        </p>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="consultation">Patient Consultation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          {renderProfile()}
        </TabsContent>
        
        <TabsContent value="consultation">
          {renderConsultation()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 