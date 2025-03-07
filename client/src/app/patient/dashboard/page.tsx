"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Droplet, 
  Scale, 
  Clock, 
  Calendar, 
  Pill, 
  AlertTriangle, 
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  BarChart3,
  PieChart,
  Wind
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MedicalHistoryList } from "@/components/features/medical-history/MedicalHistoryList";
import { MedicalRecordDetail } from "@/components/features/medical-history/MedicalRecordDetail";
import { HealthMetricsGrid } from "@/components/features/dashboard/HealthMetricsGrid";
import { HealthCharts } from "@/components/features/dashboard/HealthCharts";
import { AiHealthInsights } from "@/components/features/dashboard/AiHealthInsights";

// Define interface for medical record
interface MedicalRecord {
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
}

// Mock data for health metrics
const healthMetrics = {
  heartRate: { current: 72, min: 60, max: 100, trend: "stable" },
  bloodPressure: { current: "120/80", min: "90/60", max: "140/90", trend: "improving" },
  bloodSugar: { current: 95, min: 70, max: 130, trend: "stable" },
  oxygenLevel: { current: 98, min: 95, max: 100, trend: "stable" },
  temperature: { current: 98.6, min: 97.8, max: 99.1, trend: "stable" },
  respiratoryRate: { current: 16, min: 12, max: 20, trend: "stable" },
  weight: { current: 165, target: 160, trend: "decreasing" },
  bmi: { current: 24.2, min: 18.5, max: 24.9, trend: "stable" },
  cholesterol: { current: 180, min: 125, max: 200, trend: "stable" }
};

const medicalHistory = [
  { 
    id: "rec1",
    date: "2023-12-15", 
    type: "Checkup", 
    description: "Annual physical examination", 
    doctor: {
      name: "Dr. Smith",
      specialty: "General Practice",
      hospital: "City Medical Center",
      contact: "smith@medical.com"
    }, 
    notes: "All vitals normal, recommended regular exercise",
    prescriptions: [
      { name: "Vitamin D", dosage: "1000 IU", frequency: "Once daily", duration: "3 months" }
    ],
    labResults: [
      { name: "Complete Blood Count", result: "Normal", referenceRange: "Standard", date: "2023-12-15" },
      { name: "Lipid Panel", result: "Total Cholesterol: 180 mg/dL", referenceRange: "<200 mg/dL", date: "2023-12-15" }
    ],
    attachments: [
      { name: "Physical Exam Report", type: "PDF", url: "/reports/physical-exam.pdf" }
    ],
    followUp: "6 months" 
  },
  { 
    id: "rec2",
    date: "2023-10-03", 
    type: "Vaccination", 
    description: "Flu shot", 
    doctor: {
      name: "Dr. Johnson",
      specialty: "Internal Medicine",
      hospital: "City Medical Center",
      contact: "johnson@medical.com"
    }, 
    notes: "No adverse reactions",
    prescriptions: [],
    labResults: [],
    attachments: [
      { name: "Vaccination Record", type: "PDF", url: "/reports/vaccination.pdf" }
    ],
    followUp: "1 year" 
  },
  { 
    id: "rec3",
    date: "2023-07-22", 
    type: "Specialist", 
    description: "Cardiology consultation", 
    doctor: {
      name: "Dr. Williams",
      specialty: "Cardiology",
      hospital: "Heart Institute",
      contact: "williams@medical.com"
    }, 
    notes: "ECG normal, recommended diet changes",
    prescriptions: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "Ongoing" }
    ],
    labResults: [
      { name: "ECG", result: "Normal sinus rhythm", referenceRange: "Normal", date: "2023-07-22" },
      { name: "Echocardiogram", result: "Normal heart function", referenceRange: "Normal", date: "2023-07-22" }
    ],
    attachments: [
      { name: "ECG Report", type: "PDF", url: "/reports/ecg.pdf" },
      { name: "Cardiology Notes", type: "PDF", url: "/reports/cardiology-notes.pdf" }
    ],
    followUp: "3 months" 
  },
  { 
    id: "rec4",
    date: "2023-05-10", 
    type: "Emergency", 
    description: "Acute bronchitis", 
    doctor: {
      name: "Dr. Brown",
      specialty: "Emergency Medicine",
      hospital: "City Medical Center",
      contact: "brown@medical.com"
    }, 
    notes: "Prescribed antibiotics for 7 days",
    prescriptions: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", duration: "7 days" },
      { name: "Guaifenesin", dosage: "400mg", frequency: "Every 4 hours as needed", duration: "7 days" }
    ],
    labResults: [
      { name: "Chest X-ray", result: "Bronchial inflammation", referenceRange: "Normal", date: "2023-05-10" }
    ],
    attachments: [
      { name: "X-ray Image", type: "DICOM", url: "/reports/xray.dcm" },
      { name: "Emergency Report", type: "PDF", url: "/reports/emergency.pdf" }
    ],
    followUp: "2 weeks" 
  },
  { 
    id: "rec5",
    date: "2023-02-18", 
    type: "Surgery", 
    description: "Appendectomy", 
    doctor: {
      name: "Dr. Davis",
      specialty: "Surgery",
      hospital: "City Medical Center",
      contact: "davis@medical.com"
    }, 
    notes: "Successful procedure, follow-up in 2 weeks",
    prescriptions: [
      { name: "Hydrocodone/Acetaminophen", dosage: "5/325mg", frequency: "Every 6 hours as needed", duration: "5 days" },
      { name: "Docusate Sodium", dosage: "100mg", frequency: "Twice daily", duration: "7 days" }
    ],
    labResults: [
      { name: "Pre-op Blood Work", result: "Normal", referenceRange: "Standard", date: "2023-02-17" },
      { name: "Pathology Report", result: "Acute appendicitis", referenceRange: "N/A", date: "2023-02-20" }
    ],
    attachments: [
      { name: "Surgical Report", type: "PDF", url: "/reports/surgery.pdf" },
      { name: "Discharge Instructions", type: "PDF", url: "/reports/discharge.pdf" }
    ],
    followUp: "2 weeks" 
  }
];

const medications = [
  { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", purpose: "Blood pressure", refillDate: "2024-04-15", adherence: 95 },
  { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", purpose: "Cholesterol", refillDate: "2024-04-22", adherence: 90 },
  { name: "Metformin", dosage: "500mg", frequency: "Twice daily", purpose: "Blood sugar", refillDate: "2024-04-10", adherence: 85 }
];

const appointments = [
  { date: "2024-04-05", time: "10:00 AM", doctor: "Dr. Smith", type: "Follow-up", location: "Main Clinic" },
  { date: "2024-04-18", time: "2:30 PM", doctor: "Dr. Williams", type: "Cardiology", location: "Heart Center" },
  { date: "2024-05-10", time: "9:15 AM", doctor: "Dr. Johnson", type: "Annual Physical", location: "Main Clinic" }
];

const riskFactors = [
  { name: "Cardiovascular Disease", risk: "Moderate", score: 65, recommendations: ["Regular exercise", "Low-sodium diet", "Stress management"] },
  { name: "Type 2 Diabetes", risk: "Low", score: 30, recommendations: ["Regular blood sugar monitoring", "Balanced diet"] },
  { name: "Hypertension", risk: "High", score: 80, recommendations: ["Blood pressure monitoring", "Medication adherence", "Reduced salt intake"] }
];

// Mock data for charts
const mockChartData = {
  heartRate: [68, 72, 70, 74, 71, 73, 72],
  bloodPressure: {
    systolic: [118, 120, 122, 119, 121, 120, 118],
    diastolic: [78, 80, 82, 79, 81, 80, 78]
  },
  bloodSugar: {
    fasting: [92, 94, 95, 93, 96, 94, 95],
    afterMeal: [120, 125, 128, 122, 126, 124, 123]
  },
  weight: [167, 166.5, 166, 165.8, 165.5, 165.2, 165],
  respiratoryRate: [15, 16, 15, 17, 16, 16, 16],
  oxygenLevel: [97, 98, 98, 99, 98, 97, 98],
  temperature: [98.4, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6],
  bmi: [24.5, 24.4, 24.3, 24.3, 24.2, 24.2, 24.2],
  cholesterol: {
    total: [185, 182, 180, 181, 179, 180, 180],
    ldl: [110, 108, 107, 106, 105, 106, 105],
    hdl: [55, 56, 55, 57, 56, 56, 57]
  }
};

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [tokenCreationTime, setTokenCreationTime] = useState<Date | null>(null);
  const [originalDuration, setOriginalDuration] = useState<number>(60 * 60 * 1000); // Default 1h

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedMedicalRecord(record);
  };

  const handleCloseRecord = () => {
    setSelectedMedicalRecord(null);
  };

  // Check for existing token in cookies on component mount
  useEffect(() => {
    const checkExistingToken = () => {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'medToken') {
          // Found existing token
          const tokenValue = decodeURIComponent(value);
          setGeneratedToken(tokenValue);
          
          // Try to get expiry from cookie
          for (let expCookie of cookies) {
            const [expName, expValue] = expCookie.trim().split('=');
            if (expName === 'medTokenExpiry') {
              const expiryTime = new Date(decodeURIComponent(expValue));
              if (expiryTime > new Date()) {
                setTokenExpiry(expiryTime);
                
                // Try to get creation time
                for (let createCookie of cookies) {
                  const [createName, createValue] = createCookie.trim().split('=');
                  if (createName === 'medTokenCreated') {
                    setTokenCreationTime(new Date(decodeURIComponent(createValue)));
                    const duration = expiryTime.getTime() - new Date(decodeURIComponent(createValue)).getTime();
                    setOriginalDuration(duration);
                    break;
                  }
                }
                break;
              }
            }
          }
        }
      }
    };
    
    checkExistingToken();
  }, []);

  const handleGenerateToken = () => {
    setIsGeneratingToken(true);
    // Simulate token generation
    setTimeout(() => {
      setIsGeneratingToken(false);
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRpZW50SWQiOiIxMjM0NTYiLCJleHBpcnkiOiIyMDI0LTA1LTMwVDIzOjU5OjU5WiJ9";
      setGeneratedToken(token);
      
      // Set token expiry based on selected duration
      const expirySelect = document.getElementById("token-validity") as HTMLSelectElement;
      const expiryValue = expirySelect?.value || "1h";
      const expiryTime = new Date();
      let durationMs = 60 * 60 * 1000; // Default 1h
      
      switch(expiryValue) {
        case "30m": 
          durationMs = 30 * 60 * 1000;
          expiryTime.setMinutes(expiryTime.getMinutes() + 30); 
          break;
        case "45m": 
          durationMs = 45 * 60 * 1000;
          expiryTime.setMinutes(expiryTime.getMinutes() + 45); 
          break;
        case "1h": 
          durationMs = 60 * 60 * 1000;
          expiryTime.setHours(expiryTime.getHours() + 1); 
          break;
        case "2h": 
          durationMs = 2 * 60 * 60 * 1000;
          expiryTime.setHours(expiryTime.getHours() + 2); 
          break;
        case "4h": 
          durationMs = 4 * 60 * 60 * 1000;
          expiryTime.setHours(expiryTime.getHours() + 4); 
          break;
        case "8h": 
          durationMs = 8 * 60 * 60 * 1000;
          expiryTime.setHours(expiryTime.getHours() + 8); 
          break;
        case "24h": 
          durationMs = 24 * 60 * 60 * 1000;
          expiryTime.setHours(expiryTime.getHours() + 24); 
          break;
        default: 
          durationMs = 60 * 60 * 1000;
          expiryTime.setHours(expiryTime.getHours() + 1);
      }
      
      setTokenExpiry(expiryTime);
      setOriginalDuration(durationMs);
      
      const creationTime = new Date();
      setTokenCreationTime(creationTime);
      
      // Set cookies with token, expiry and creation time
      document.cookie = `medToken=${token}; expires=${expiryTime.toUTCString()}; path=/; secure; samesite=strict`;
      document.cookie = `medTokenExpiry=${expiryTime.toUTCString()}; expires=${expiryTime.toUTCString()}; path=/; secure; samesite=strict`;
      document.cookie = `medTokenCreated=${creationTime.toUTCString()}; expires=${expiryTime.toUTCString()}; path=/; secure; samesite=strict`;
    }, 1500);
  };

  // Update remaining time
  useEffect(() => {
    if (!tokenExpiry) return;
    
    const updateRemainingTime = () => {
      const now = new Date();
      const diff = tokenExpiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setGeneratedToken(null);
        setTokenExpiry(null);
        setTokenCreationTime(null);
        setRemainingTime("");
        // Clear cookies
        document.cookie = "medToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "medTokenExpiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "medTokenCreated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setRemainingTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    
    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      // Could add a toast notification here
    }
  };

  // Calculate percentage of time remaining
  const calculateTimeRemainingPercentage = () => {
    if (!tokenExpiry || !tokenCreationTime) return 0;
    
    const now = new Date();
    const totalDuration = originalDuration;
    const elapsed = now.getTime() - tokenCreationTime.getTime();
    const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    
    return 100 - percentage; // Return remaining percentage
  };

  // Update token display formatting
  const formatTokenForDisplay = (token: string) => {
    if (!token) return "";
    const firstPart = token.substring(0, 8);
    const lastPart = token.substring(token.length - 6);
    const maskedLength = token.length - 14;
    const maskedPart = "•".repeat(Math.min(maskedLength, 24));
    return `${firstPart}${maskedPart}${lastPart}`;
  };

  // Handle closing modal without removing token
  const handleCloseModal = () => {
    setShowTokenModal(false);
    // Don't reset token state, just close the modal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 -z-10" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] -z-10" />
      
      {/* Token Generation Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {generatedToken ? "Active Access Token" : "Generate Access Token"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {!generatedToken ? (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create a secure token to share your medical data with healthcare providers.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Token Validity Period</label>
                  <select 
                    id="token-validity"
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="30m">30 minutes</option>
                    <option value="45m">45 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="2h">2 hours</option>
                    <option value="4h">4 hours</option>
                    <option value="8h">8 hours</option>
                    <option value="24h">24 hours (max)</option>
                  </select>
                </div>
                
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Data to Share</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="checkbox" id="share-vitals" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                      <label htmlFor="share-vitals" className="text-sm">Vital Signs (heart rate, blood pressure, etc.)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="share-medications" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                      <label htmlFor="share-medications" className="text-sm">Current Medications & Adherence</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="share-history" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                      <label htmlFor="share-history" className="text-sm">Medical History Records</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="share-lab" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                      <label htmlFor="share-lab" className="text-sm">Lab Results & Diagnostic Tests</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="share-risk" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="share-risk" className="text-sm">Risk Assessments & Predictions</label>
                    </div>
                    
                    <div className="pt-2 border-t border-blue-100 dark:border-blue-800">
                      <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Specific Conditions</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="share-cardiac" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="share-cardiac" className="text-sm">Cardiac</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="share-diabetes" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="share-diabetes" className="text-sm">Diabetes</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="share-respiratory" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="share-respiratory" className="text-sm">Respiratory</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="share-allergies" className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="share-allergies" className="text-sm">Allergies</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGenerateToken} 
                    disabled={isGeneratingToken}
                    className="relative bg-blue-600 hover:bg-blue-700"
                  >
                    {isGeneratingToken ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </div>
                    ) : "Generate Token"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-center font-medium mb-2 text-lg">Token Generated Successfully</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  Share this token with your healthcare provider
                </p>
                
                {/* Enhanced Token Display */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-md mb-4 relative border border-gray-200 dark:border-gray-600 shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">ACCESS TOKEN</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Active
                    </span>
                  </div>
                  <p className="text-sm font-mono tracking-wider text-center py-2 select-all">
                    {formatTokenForDisplay(generatedToken)}
                  </p>
                  <button 
                    onClick={handleCopyToken}
                    className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Copy token"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                
                {/* Enhanced Token Expiry Countdown */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-800 dark:text-gray-200">Token Expires In</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-lg font-mono font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md text-blue-700 dark:text-blue-300 tracking-wider">
                        {remainingTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300">
                          Time Remaining
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                          {Math.round(calculateTimeRemainingPercentage())}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                      <div 
                        style={{ width: `${calculateTimeRemainingPercentage()}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700"
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6 border border-blue-100 dark:border-blue-800">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <span className="font-medium">Important:</span> This token grants temporary access to your medical data. Do not share it with unauthorized individuals.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between gap-3">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => {
                      setGeneratedToken(null);
                      setTokenExpiry(null);
                      setTokenCreationTime(null);
                      // Clear cookies
                      document.cookie = "medToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      document.cookie = "medTokenExpiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      document.cookie = "medTokenCreated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      setShowTokenModal(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Revoke Token
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={handleCloseModal}
                    >
                      Close
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleCopyToken}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Token
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Enhanced Active Token Indicator */}
      {generatedToken && tokenExpiry && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 max-w-xs animate-in slide-in-from-right-10 duration-300 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                <h4 className="font-medium text-sm">Active Token</h4>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setShowTokenModal(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="View token details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  onClick={handleCopyToken}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Copy token"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-2 rounded-md mb-3 text-center border border-blue-200 dark:border-blue-800/50">
              <p className="text-xs font-mono tracking-wider text-blue-700 dark:text-blue-300">
                {formatTokenForDisplay(generatedToken)}
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-gray-600 dark:text-gray-400">Expires in:</span>
              <span className="font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">{remainingTime}</span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 h-2 rounded-full"
                style={{ width: `${calculateTimeRemainingPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, John Doe</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-5 text-base shadow-lg hover:shadow-xl transition-all"
              onClick={() => setShowTokenModal(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Generate Access Token
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
        
        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Prominent Token Generation Card - Enhanced with active token display */}
            <Card className={`${generatedToken ? 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700'} text-white hover:shadow-lg transition-all border-none mb-6`}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-white/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div>
                      {generatedToken ? (
                        <>
                          <h3 className="text-xl font-bold">Active Access Token</h3>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                            <p className="text-blue-100">Expires in: {remainingTime}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold">Share Your Medical Data</h3>
                          <p className="text-blue-100">Generate a secure access token for your healthcare providers</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {generatedToken ? (
                    <div className="flex flex-col items-end">
                      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-md mb-2 text-center w-full md:w-auto border border-white/20">
                        <p className="text-xs font-mono tracking-wider">
                          {formatTokenForDisplay(generatedToken)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                          onClick={handleCopyToken}
                          size="sm"
                        >
                          Copy
                        </Button>
                        <Button 
                          className="bg-white text-blue-600 hover:bg-blue-50"
                          onClick={() => setShowTokenModal(true)}
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 shadow-md"
                      onClick={() => setShowTokenModal(true)}
                    >
                      Generate Token
                    </Button>
                  )}
                </div>
                
                {/* Progress bar for active token */}
                {generatedToken && (
                  <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-300 to-white h-2 rounded-full"
                        style={{ width: `${calculateTimeRemainingPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Health Metrics Grid */}
            <div className="">
              <HealthMetricsGrid metrics={healthMetrics} />
            </div>
            
            {/* Health Charts */}
            <div className="mt-6">
              <HealthCharts chartData={mockChartData} />
            </div>
            
            {/* Risk Factors */}
            <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Health Risk Factors
                </CardTitle>
                <CardDescription>
                  Personalized risk assessment based on your health data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskFactors.map((factor, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h4 className="font-semibold">{factor.name}</h4>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          factor.risk === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                          factor.risk === "Moderate" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}>
                          {factor.risk} Risk
                        </span>
                      </div>
                      <Progress value={factor.score} className="h-2 mb-2" />
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recommendations:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                          {factor.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Medical History Tab */}
          <TabsContent value="history" className="space-y-6">
            {selectedMedicalRecord ? (
              <MedicalRecordDetail 
                record={selectedMedicalRecord} 
                onClose={handleCloseRecord} 
              />
            ) : (
              <MedicalHistoryList 
                records={medicalHistory} 
                onSelectRecord={handleRecordSelect} 
              />
            )}
          </TabsContent>
          
          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-primary" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h4 className="font-semibold">{medication.name}</h4>
                        <span className="text-sm text-gray-500">Refill by: {medication.refillDate}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Dosage:</span> {medication.dosage}
                        </div>
                        <div>
                          <span className="text-gray-500">Frequency:</span> {medication.frequency}
                        </div>
                        <div>
                          <span className="text-gray-500">Purpose:</span> {medication.purpose}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Adherence Rate:</p>
                        <div className="flex items-center">
                          <Progress value={medication.adherence} className="h-2 flex-1" />
                          <span className="ml-2 text-sm font-medium">{medication.adherence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Request Refill</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <AiHealthInsights patientName="John" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
