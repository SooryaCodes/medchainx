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
      <Card className="border-none shadow-md overflow-hidden rounded-xl">
        <CardHeader className="bg-blue-600 text-white p-6">
          <CardTitle className="text-2xl">Doctor Profile</CardTitle>
          <CardDescription className="text-blue-100">Your professional information</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 bg-white">
          {doctor && (
            <>
              <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
                <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center border-4 border-white shadow-md">
                  <User size={40} className="text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Dr. {doctor.name.given.join(' ')} {doctor.name.family}
                  </h3>
                  <p className="text-blue-600 font-medium text-lg">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Hospital size={18} />
                    <span>{typeof doctor.hospitalId === 'object' && doctor.hospitalId ? (doctor.hospitalId as any).name || 'Unknown Hospital' : doctor.hospitalId}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-blue-600">
                      <Stethoscope size={20} />
                    </div>
                    <h4 className="font-semibold text-gray-800">Professional Information</h4>
                  </div>
                  
                  <div className="space-y-4">
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
                
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-blue-600">
                      <Calendar size={20} />
                    </div>
                    <h4 className="font-semibold text-gray-800">Schedule</h4>
                  </div>
                  
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-blue-600">
                      <Languages size={20} />
                    </div>
                    <h4 className="font-semibold text-gray-800">Languages</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {doctor.languagesSpoken.map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800">Contact Information</h4>
                  </div>
                  
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
      <Card className="border-none shadow-md overflow-hidden rounded-xl">
        <CardHeader className="bg-blue-600 text-white p-6">
          <CardTitle className="text-2xl">Patient Consultation</CardTitle>
          <CardDescription className="text-blue-100">
            Enter the patient's access token to view their medical records
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 bg-white">
          {!isAccessTokenValid ? (
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mb-6">
                <p className="text-blue-800 flex items-center">
                  <Search size={18} className="mr-2" />
                  Enter the patient's access token to securely view their medical records
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="accessToken" className="text-sm font-medium text-gray-700 block mb-1">
                    Patient Access Token
                  </label>
                  <div className="relative">
                    <Input
                      id="accessToken"
                      placeholder="Enter the access token provided by the patient"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  {accessError && (
                    <p className="text-sm text-red-600 flex items-center mt-2">
                      <span className="mr-1">⚠️</span> {accessError}
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={handleAccessPatientRecords} 
                  disabled={isLoading || !accessToken}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 h-11 rounded-lg"
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
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">About Patient Tokens</h4>
                <p className="text-sm text-gray-600">
                  Patient access tokens are temporary credentials that allow secure access to medical records. 
                  Tokens expire after the consultation period and all access is logged for security purposes.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Information Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-4 rounded-t-xl">
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
                <Card className="border-blue-200 shadow-md rounded-xl">
                  <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-xl">
                    <CardTitle className="text-blue-800 flex items-center text-lg">
                      <BarChart3 size={20} className="mr-2" />
                      AI-Generated Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 bg-white">
                    <p className="text-gray-700 leading-relaxed">{recordSummary}</p>
                  </CardContent>
                </Card>
              )}
              
              {/* Medical Records */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-4 rounded-t-xl">
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
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
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
    <Card className="mb-6 border-none shadow-md overflow-hidden rounded-xl">
      <CardContent className="p-0">
        <div className="bg-blue-600 p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white">MedChainX</h2>
              <p className="text-blue-100">Your secure blockchain-based medical records platform</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 h-40 w-40 bg-white/10 rounded-full"></div>
          <div className="absolute right-20 top-20 h-24 w-24 bg-white/10 rounded-full"></div>
          <div className="absolute left-1/3 -bottom-10 h-20 w-20 bg-white/10 rounded-full"></div>
          
          {/* Animated dots */}
          <div className="absolute right-12 bottom-4 h-2 w-2 bg-blue-200 rounded-full animate-ping"></div>
          <div className="absolute left-1/4 bottom-6 h-2 w-2 bg-blue-200 rounded-full animate-pulse delay-300"></div>
          <div className="absolute right-1/3 top-6 h-2 w-2 bg-blue-200 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="p-4 bg-white">
          <div className="flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">
                Secure & Immutable
              </p>
              <p className="text-sm text-gray-900 truncate">
                All medical records are cryptographically secured
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">
                Patient-Controlled
              </p>
              <p className="text-sm text-gray-900 truncate">
                Patients control access to their data
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">
                Interoperable
              </p>
              <p className="text-sm text-gray-900 truncate">
                Works across healthcare systems
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-1.5 rounded-md mr-2">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MedChainX</h1>
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
              <Button variant="outline" size="sm" onClick={logout} className="text-gray-600 border-gray-300 rounded-lg">
                <LogOut size={16} className="mr-1" /> Logout
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
            <Card className="overflow-hidden border-none shadow-md rounded-xl">
              <CardHeader className="bg-blue-600 text-white p-4 rounded-t-xl">
                <CardTitle className="text-lg font-medium">Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-2 bg-white">
                <div className="space-y-1">
                  <Button 
                    variant={activeTab === "profile" ? "subtle" : "ghost"}
                    onClick={() => setActiveTab("profile")}
                    className={`w-full justify-start rounded-lg ${
                      activeTab === "profile" 
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <User size={16} className="mr-2" />
                    <span>Profile</span>
                  </Button>
                  <Button 
                    variant={activeTab === "consultation" ? "subtle" : "ghost"}
                    onClick={() => setActiveTab("consultation")}
                    className={`w-full justify-start rounded-lg ${
                      activeTab === "consultation" 
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FileText size={16} className="mr-2" />
                    <span>Consultation</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
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