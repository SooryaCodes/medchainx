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
  Video,
  BarChart3
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
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-2xl">Doctor Profile</CardTitle>
          <CardDescription className="text-blue-100">Your professional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {doctor && (
            <>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-blue-100 rounded-full w-28 h-28 flex items-center justify-center border-4 border-white shadow-md">
                  <User size={48} className="text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Dr. {doctor.name.given.join(' ')} {doctor.name.family}
                  </h3>
                  <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hospital size={18} />
                    <span>{typeof doctor.hospitalId === 'object' && doctor.hospitalId ? (doctor.hospitalId as any).name || 'Unknown Hospital' : doctor.hospitalId}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <Stethoscope size={20} className="text-blue-600" /> Professional Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Specialty</span>
                      <span className="font-medium">{doctor.specialty}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{doctor.yearsOfExperience} years</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="flex items-center font-medium text-green-600">
                        <DollarSign size={16} className="mr-1" />
                        {doctor.consultationFee}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Telemedicine</span>
                      <span className="flex items-center gap-1 font-medium">
                        {doctor.telemedicineAvailable ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            <Video size={14} className="inline mr-1" /> Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            Not available
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <Calendar size={20} className="text-blue-600" /> Schedule
                  </h4>
                  <div className="space-y-3">
                    {doctor.availableTimings.map((timing, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 font-medium">{timing.day}</span>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                          <Clock size={14} className="mr-1" /> {timing.startTime} - {timing.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Languages size={20} className="text-blue-600" /> Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.languagesSpoken.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                <h4 className="font-semibold text-gray-800 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">{doctor.contact.phone}</span>
                  </div>
                  {doctor.contact.email && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium">{doctor.contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
              <p className="flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  // Render patient consultation section
  const renderConsultation = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-2xl">Patient Consultation</CardTitle>
          <CardDescription className="text-blue-100">
            Enter the patient's access token to view their medical records
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!isAccessTokenValid ? (
            <div className="max-w-md mx-auto space-y-6 py-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <p className="text-blue-800 flex items-center">
                  <Search size={18} className="mr-2" />
                  Enter the patient's access token to securely view their medical records
                </p>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="accessToken" className="text-sm font-medium text-gray-700 block">
                  Patient Access Token
                </label>
                <Input
                  id="accessToken"
                  placeholder="Enter the access token provided by the patient"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                {accessError && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span> {accessError}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleAccessPatientRecords} 
                disabled={isLoading || !accessToken}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Search size={18} className="mr-2" />
                    Access Patient Records
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Information Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                  <h3 className="font-semibold text-lg">Patient Information</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-sm text-indigo-600 font-medium">Name</p>
                      <p className="font-semibold text-gray-800">{patientData.name.given.join(' ')} {patientData.name.family}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-sm text-indigo-600 font-medium">Date of Birth</p>
                      <p className="font-semibold text-gray-800">{new Date(patientData.birthDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-sm text-indigo-600 font-medium">Gender</p>
                      <p className="font-semibold text-gray-800">{patientData.gender}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-sm text-indigo-600 font-medium">Blood Type</p>
                      <p className="font-semibold text-gray-800">{patientData.bloodType}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Medical Records Summary */}
              {recordSummary && (
                <Card className="border-blue-200 shadow-md">
                  <CardHeader className="bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-blue-800 flex items-center text-lg">
                      <BarChart3 size={20} className="mr-2" />
                      AI-Generated Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-700 leading-relaxed">{recordSummary}</p>
                  </CardContent>
                </Card>
              )}
              
              {/* Medical Records */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                  <h3 className="font-semibold text-lg">Medical Records</h3>
                </div>
                <div className="p-4">
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
              </div>
              
              <Button 
                variant="outline" 
                onClick={resetPatientAccess} 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Clock size={18} className="mr-2" />
                Finish Consultation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  // Add the renderMedChainX function similar to the patient dashboard
  const renderMedChainX = () => (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 shadow-md hover:shadow-lg transition-all overflow-hidden relative">
      <div className="flex items-center justify-between">
        <div className="z-10">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">MedChainX</h2>
          <p className="text-gray-600 dark:text-gray-300">Your secure blockchain-based medical records platform</p>
        </div>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute -right-12 -top-12 h-24 w-24 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute right-20 bottom-0 h-3 w-3 bg-blue-400 dark:bg-blue-600 rounded-full animate-ping"></div>
      <div className="absolute left-1/2 bottom-2 h-2 w-2 bg-blue-300 dark:bg-blue-500 rounded-full animate-pulse"></div>
      
      {/* Animated line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse" style={{
        width: '100%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">MediConnect</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {doctor && (
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-2">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700 hidden md:inline-block">
                    Dr. {doctor.name.given.join(' ')} {doctor.name.family}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600">
                <LogOut size={18} className="mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 sm:px-6 max-w-7xl">
        {/* Add the MedChainX component here */}
        {renderMedChainX()}
        
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-blue-600 text-white">
                <h2 className="font-semibold">Dashboard</h2>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                    activeTab === "profile" 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User size={18} className="mr-2" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab("consultation")}
                  className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                    activeTab === "consultation" 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FileText size={18} className="mr-2" />
                  <span>Consultation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {activeTab === "profile" ? renderProfile() : renderConsultation()}
          </div>
        </div>
      </div>
    </div>
  );
} 