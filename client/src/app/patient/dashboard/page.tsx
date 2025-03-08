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
  Wind,
  LogOut
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
import { usePatient } from "@/context/PatientContext";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

import { PatientProfile } from "@/components/features/patient/PatientProfile";
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

// Use the existing mock data for now
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
    followUp: "6 months",
    status: "final",
    tags: ["checkup", "annual"]
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
    followUp: "1 year",
    status: "final",
    tags: ["vaccination", "preventive"]
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
    followUp: "6 months",
    status: "final",
    tags: ["cardiology", "heart"]
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
  const { patient, loading, error, logout, token, fetchPatient, remainingTime, setRemainingTime } = usePatient();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<DashboardMedicalRecord | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [tokenCreationTime, setTokenCreationTime] = useState<Date | null>(null);
  const [originalDuration, setOriginalDuration] = useState<number>(60 * 60 * 1000); // Default 1h
  const [formattedTime, setFormattedTime] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [patientMedicalRecords, setPatientMedicalRecords] = useState<DashboardMedicalRecord[]>([]);
  const [riskFactors, setRiskFactors] = useState<any[]>([]);  // Initialize as empty array
  const [isLoadingRisks, setIsLoadingRisks] = useState(false);
  const [riskError, setRiskError] = useState<string | null>(null);

  const fetchHealthRisks = async () => {
    console.log("fetchHealthRisks called");
    
    setIsLoadingRisks(true);
    setRiskError(null);
    
    try {
      // Add artificial delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 second delay
      
      if (patient) {
        console.log(patient, "patient");
        try {
          const response = await axios.get(`/patiendt/${(patient as any)._id}/health-risks`);
          console.log(response.data, "response.data health risk");
          
          if (response.data && Array.isArray(response.data)) {
            setRiskFactors(response.data);
          } else {
            // Fallback to enhanced mock data if API doesn't return proper format
            setRiskFactors([
              { 
                name: "Cardiovascular Disease", 
                risk: "Moderate", 
                score: 65, 
                recommendations: [
                  "30 minutes of cardio exercise 5 days a week",
                  "Mediterranean diet with reduced sodium intake",
                  "Daily stress management through meditation",
                  "Regular blood pressure monitoring at home"
                ],
                lifestyle: {
                  diet: "Reduce saturated fats, increase omega-3 fatty acids, limit sodium to <2,300mg daily",
                  exercise: "150 minutes of moderate-intensity aerobic activity weekly",
                  habits: "Avoid smoking, limit alcohol to 1 drink daily",
                  monitoring: "Check blood pressure weekly, schedule quarterly lipid panels"
                },
                metrics: {
                  current: "BP: 135/85, Cholesterol: 210mg/dL, Triglycerides: 165mg/dL",
                  target: "BP: <120/80, Cholesterol: <200mg/dL, Triglycerides: <150mg/dL"
                }
              },
              { 
                name: "Type 2 Diabetes", 
                risk: "Low", 
                score: 30, 
                recommendations: [
                  "Regular A1C testing every 6 months",
                  "Balanced diet with controlled carbohydrate intake",
                  "Daily foot examination for early detection of complications",
                  "Stay hydrated with 8-10 glasses of water daily"
                ],
                lifestyle: {
                  diet: "Low glycemic index foods, portion control, limit added sugars to <25g daily",
                  exercise: "Combine aerobic exercise with resistance training 3-4 times weekly",
                  habits: "Regular sleep schedule (7-8 hours), stress management",
                  monitoring: "Check blood glucose levels as recommended by your physician"
                },
                metrics: {
                  current: "Fasting glucose: 95mg/dL, A1C: 5.6%",
                  target: "Fasting glucose: 70-99mg/dL, A1C: <5.7%"
                }
              },
              { 
                name: "Hypertension", 
                risk: "High", 
                score: 80, 
                recommendations: [
                  "DASH diet (Dietary Approaches to Stop Hypertension)",
                  "Daily blood pressure monitoring and logging",
                  "Reduce caffeine and alcohol consumption",
                  "Progressive muscle relaxation techniques for stress"
                ],
                lifestyle: {
                  diet: "DASH diet with potassium-rich foods, limit sodium to <1,500mg daily",
                  exercise: "Regular aerobic activity with moderate intensity, avoid high-intensity exercises",
                  habits: "Maintain healthy weight, practice deep breathing exercises daily",
                  monitoring: "Monitor BP at the same time daily, keep detailed log for physician review"
                },
                metrics: {
                  current: "Systolic: 145mmHg, Diastolic: 92mmHg, Resting HR: 78bpm",
                  target: "Systolic: <120mmHg, Diastolic: <80mmHg, Resting HR: 60-70bpm"
                }
              },
              { 
                name: "Osteoporosis", 
                risk: "Moderate", 
                score: 55, 
                recommendations: [
                  "Weight-bearing exercises 3 times weekly",
                  "Calcium and vitamin D supplementation",
                  "Bone density scan annually",
                  "Fall prevention strategies at home"
                ],
                lifestyle: {
                  diet: "1,200mg calcium daily, 800-1000 IU vitamin D, adequate protein intake",
                  exercise: "Weight-bearing and resistance exercises, balance training",
                  habits: "Limit alcohol and caffeine, quit smoking",
                  monitoring: "DEXA scan as recommended, height measurement annually"
                },
                metrics: {
                  current: "T-score: -1.8, Calcium: 9.2mg/dL, Vitamin D: 28ng/mL",
                  target: "T-score: >-1.0, Calcium: 8.5-10.5mg/dL, Vitamin D: 30-50ng/mL"
                }
              }
            ]);
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          // Fallback to enhanced mock data on API error
          setRiskFactors([
            { 
              name: "Cardiovascular Disease", 
              risk: "Moderate", 
              score: 65, 
              recommendations: [
                "30 minutes of cardio exercise 5 days a week",
                "Mediterranean diet with reduced sodium intake",
                "Daily stress management through meditation",
                "Regular blood pressure monitoring at home"
              ],
              lifestyle: {
                diet: "Reduce saturated fats, increase omega-3 fatty acids, limit sodium to <2,300mg daily",
                exercise: "150 minutes of moderate-intensity aerobic activity weekly",
                habits: "Avoid smoking, limit alcohol to 1 drink daily",
                monitoring: "Check blood pressure weekly, schedule quarterly lipid panels"
              },
              metrics: {
                current: "BP: 135/85, Cholesterol: 210mg/dL, Triglycerides: 165mg/dL",
                target: "BP: <120/80, Cholesterol: <200mg/dL, Triglycerides: <150mg/dL"
              }
            },
            { 
              name: "Type 2 Diabetes", 
              risk: "Low", 
              score: 30, 
              recommendations: [
                "Regular A1C testing every 6 months",
                "Balanced diet with controlled carbohydrate intake",
                "Daily foot examination for early detection of complications",
                "Stay hydrated with 8-10 glasses of water daily"
              ],
              lifestyle: {
                diet: "Low glycemic index foods, portion control, limit added sugars to <25g daily",
                exercise: "Combine aerobic exercise with resistance training 3-4 times weekly",
                habits: "Regular sleep schedule (7-8 hours), stress management",
                monitoring: "Check blood glucose levels as recommended by your physician"
              },
              metrics: {
                current: "Fasting glucose: 95mg/dL, A1C: 5.6%",
                target: "Fasting glucose: 70-99mg/dL, A1C: <5.7%"
              }
            },
            { 
              name: "Hypertension", 
              risk: "High", 
              score: 80, 
              recommendations: [
                "DASH diet (Dietary Approaches to Stop Hypertension)",
                "Daily blood pressure monitoring and logging",
                "Reduce caffeine and alcohol consumption",
                "Progressive muscle relaxation techniques for stress"
              ],
              lifestyle: {
                diet: "DASH diet with potassium-rich foods, limit sodium to <1,500mg daily",
                exercise: "Regular aerobic activity with moderate intensity, avoid high-intensity exercises",
                habits: "Maintain healthy weight, practice deep breathing exercises daily",
                monitoring: "Monitor BP at the same time daily, keep detailed log for physician review"
              },
              metrics: {
                current: "Systolic: 145mmHg, Diastolic: 92mmHg, Resting HR: 78bpm",
                target: "Systolic: <120mmHg, Diastolic: <80mmHg, Resting HR: 60-70bpm"
              }
            },
            { 
              name: "Osteoporosis", 
              risk: "Moderate", 
              score: 55, 
              recommendations: [
                "Weight-bearing exercises 3 times weekly",
                "Calcium and vitamin D supplementation",
                "Bone density scan annually",
                "Fall prevention strategies at home"
              ],
              lifestyle: {
                diet: "1,200mg calcium daily, 800-1000 IU vitamin D, adequate protein intake",
                exercise: "Weight-bearing and resistance exercises, balance training",
                habits: "Limit alcohol and caffeine, quit smoking",
                monitoring: "DEXA scan as recommended, height measurement annually"
              },
              metrics: {
                current: "T-score: -1.8, Calcium: 9.2mg/dL, Vitamin D: 28ng/mL",
                target: "T-score: >-1.0, Calcium: 8.5-10.5mg/dL, Vitamin D: 30-50ng/mL"
              }
            }
          ]);
        }
      } else {
        // If no patient ID, use enhanced mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setRiskFactors([
          { 
            name: "Cardiovascular Disease", 
            risk: "Moderate", 
            score: 65, 
            recommendations: [
              "30 minutes of cardio exercise 5 days a week",
              "Mediterranean diet with reduced sodium intake",
              "Daily stress management through meditation",
              "Regular blood pressure monitoring at home"
            ],
            lifestyle: {
              diet: "Reduce saturated fats, increase omega-3 fatty acids, limit sodium to <2,300mg daily",
              exercise: "150 minutes of moderate-intensity aerobic activity weekly",
              habits: "Avoid smoking, limit alcohol to 1 drink daily",
              monitoring: "Check blood pressure weekly, schedule quarterly lipid panels"
            },
            metrics: {
              current: "BP: 135/85, Cholesterol: 210mg/dL, Triglycerides: 165mg/dL",
              target: "BP: <120/80, Cholesterol: <200mg/dL, Triglycerides: <150mg/dL"
            }
          },
          { 
            name: "Type 2 Diabetes", 
            risk: "Low", 
            score: 30, 
            recommendations: [
              "Regular A1C testing every 6 months",
              "Balanced diet with controlled carbohydrate intake",
              "Daily foot examination for early detection of complications",
              "Stay hydrated with 8-10 glasses of water daily"
            ],
            lifestyle: {
              diet: "Low glycemic index foods, portion control, limit added sugars to <25g daily",
              exercise: "Combine aerobic exercise with resistance training 3-4 times weekly",
              habits: "Regular sleep schedule (7-8 hours), stress management",
              monitoring: "Check blood glucose levels as recommended by your physician"
            },
            metrics: {
              current: "Fasting glucose: 95mg/dL, A1C: 5.6%",
              target: "Fasting glucose: 70-99mg/dL, A1C: <5.7%"
            }
          },
          { 
            name: "Hypertension", 
            risk: "High", 
            score: 80, 
            recommendations: [
              "DASH diet (Dietary Approaches to Stop Hypertension)",
              "Daily blood pressure monitoring and logging",
              "Reduce caffeine and alcohol consumption",
              "Progressive muscle relaxation techniques for stress"
            ],
            lifestyle: {
              diet: "DASH diet with potassium-rich foods, limit sodium to <1,500mg daily",
              exercise: "Regular aerobic activity with moderate intensity, avoid high-intensity exercises",
              habits: "Maintain healthy weight, practice deep breathing exercises daily",
              monitoring: "Monitor BP at the same time daily, keep detailed log for physician review"
            },
            metrics: {
              current: "Systolic: 145mmHg, Diastolic: 92mmHg, Resting HR: 78bpm",
              target: "Systolic: <120mmHg, Diastolic: <80mmHg, Resting HR: 60-70bpm"
            }
          },
          { 
            name: "Osteoporosis", 
            risk: "Moderate", 
            score: 55, 
            recommendations: [
              "Weight-bearing exercises 3 times weekly",
              "Calcium and vitamin D supplementation",
              "Bone density scan annually",
              "Fall prevention strategies at home"
            ],
            lifestyle: {
              diet: "1,200mg calcium daily, 800-1000 IU vitamin D, adequate protein intake",
              exercise: "Weight-bearing and resistance exercises, balance training",
              habits: "Limit alcohol and caffeine, quit smoking",
              monitoring: "DEXA scan as recommended, height measurement annually"
            },
            metrics: {
              current: "T-score: -1.8, Calcium: 9.2mg/dL, Vitamin D: 28ng/mL",
              target: "T-score: >-1.0, Calcium: 8.5-10.5mg/dL, Vitamin D: 30-50ng/mL"
            }
          }
        ]);
      }
    } catch (error) {
      console.error("Error in health risk analysis:", error);
      setRiskError("Failed to load health risk data. Please try again later.");
    } finally {
      setIsLoadingRisks(false);
    }
  };

  useEffect(() => {
    if (patient && patient.medicalReports && patient.medicalReports.length > 0) {
      const transformedRecords = patient.medicalReports.map((report: any) => {
        return {
          id: report._id.$oid || report._id || `report-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date(report.date.$date || report.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          type: report.type || (report.title ? report.title.split(' ')[0] : 'General'),
          description: report.title,
          doctor: {
            name: report.doctor?.name || 'Unknown Doctor',
            specialty: report.doctor?.specialty || 'General Practice',
            hospital: report.doctor?.hospital?.name || 'Unknown Hospital',
            contact: report.doctor?.hospital?.address || 'No contact information'
          },
          notes: report.content || report.additionalNotes || '',
          prescriptions: report.prescription?.medications?.map((med: any) => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.startDate && med.endDate ? 
              `${new Date(med.startDate.$date || med.startDate).toLocaleDateString()} - ${new Date(med.endDate.$date || med.endDate).toLocaleDateString()}` : 
              "As prescribed"
          })) || [],
          labResults: report.labReport?.results?.map((result: any) => ({
            name: result.parameter,
            result: result.value,
            referenceRange: result.normalRange,
            date: report.labReport.testDate ? new Date(report.labReport.testDate.$date || report.labReport.testDate).toLocaleDateString() : 
              new Date(report.date.$date || report.date).toLocaleDateString(),
            interpretation: result.interpretation
          })) || [],
          attachments: [],  // You can populate this if you have attachments in your data
          followUp: report.additionalNotes || "As recommended",
          status: report.status || 'final',
          tags: report.tags || []
        };
      });
      setPatientMedicalRecords(transformedRecords);
    } else {
      // Use mock data if no patient data is available
      setPatientMedicalRecords(medicalHistory as DashboardMedicalRecord[]);
    }
  }, [patient]);

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
    
    // Add this code to fetch patient data
    console.log('Dashboard mounted, checking if patient data needs to be fetched...');
    if (token && !patient) {
      console.log('Token exists but no patient data, fetching patient data...');
      fetchPatient();
    }
  }, [token, patient, fetchPatient]);

  useEffect(() => {
    if (!tokenExpiry) return;
    
    const updateRemainingTime = () => {
      const now = new Date();
      const diff = tokenExpiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setGeneratedToken(null);
        setTokenExpiry(null);
        setTokenCreationTime(null);
        setRemainingTime(null);
        // Clear cookies
        document.cookie = "medToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "medTokenExpiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "medTokenCreated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return;
      }
      
      // Format the time as a string before setting it
      const totalSeconds = diff / 1000;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      setRemainingTime(totalSeconds.toString());
      setFormattedTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    
    return () => clearInterval(interval);
  }, [tokenExpiry]);

  useEffect(() => {
    // Remove this effect that automatically fetches risks when tab changes
    // We'll only fetch when the user clicks the button now
  }, [activeTab, patient]);

  const handleRecordSelect = (record: DashboardMedicalRecord) => {
    setSelectedMedicalRecord(record);
  };

  const handleCloseRecord = () => {
    setSelectedMedicalRecord(null);
  };

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
      document.cookie = `Expiry=${expiryTime.toUTCString()}; expires=${expiryTime.toUTCString()}; path=/; secure; samesite=strict`;
      document.cookie = `medTokenCreated=${creationTime.toUTCString()}; expires=${expiryTime.toUTCString()}; path=/; secure; samesite=strict`;
    }, 1500);
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      // Could add a toast notification here
    }
  };

  const calculateTimeRemainingPercentage = () => {
    if (!tokenExpiry || !tokenCreationTime) return 0;
    
    const now = new Date();
    const totalDuration = originalDuration;
    const elapsed = now.getTime() - tokenCreationTime.getTime();
    const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    
    return 100 - percentage; // Return remaining percentage
  };

  const formatTokenForDisplay = (token: string) => {
    if (!token) return "";
    const firstPart = token.substring(0, 8);
    const lastPart = token.substring(token.length - 6);
    const maskedLength = token.length - 14;
    const maskedPart = "•".repeat(Math.min(maskedLength, 24));
    return `${firstPart}${maskedPart}${lastPart}`;
  };

  const handleCloseModal = () => {
    setShowTokenModal(false);
    // Don't reset token state, just close the modal
  };

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
  )

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading your medical data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  const handleCloseProfile = () => {
    setShowProfile(false);
  };
  
  return (
    <div className="container mx-auto p-6">
      {renderMedChainX()}
      
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
                        {formattedTime}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
              <span className="font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">{formattedTime}</span>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {patient ? `${patient.name.given.join(' ')} ${patient.name.family}` : 'Loading...'}
            </p>
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
            <Button 
              variant={showProfile ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setShowProfile(!showProfile)}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        {showProfile && (
          <PatientProfile 
            patient={patient} 
            onClose={handleCloseProfile} 
          />
        )}
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 md:w-[750px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="risks">Health Risks</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className={`${generatedToken ? 'bg-gradient-to-r from-blue-500 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white hover:shadow-lg transition-all border-none mb-6`}>
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
                            <p className="text-blue-100">Expires in: {formattedTime}</p>
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
            
            <div className="">
              <HealthMetricsGrid metrics={healthMetrics} />
            </div>
            
            <div className="mt-6">
              <HealthCharts chartData={mockChartData} />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            {selectedMedicalRecord ? (
              <MedicalRecordDetail 
                record={selectedMedicalRecord} 
                onClose={handleCloseRecord} 
              />
            ) : (
              <MedicalHistoryList 
                records={patientMedicalRecords.length > 0 ? patientMedicalRecords : medicalHistory as DashboardMedicalRecord[]} 
                onSelectRecord={handleRecordSelect} 
              />
            )}
          </TabsContent>
          
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
                  {(patient as any)?.prescriptions && (patient as any).prescriptions.length > 0 ? (
                    (patient as any).prescriptions.map((prescription: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h4 className="font-semibold">{prescription.medication}</h4>
                          <div className="flex items-center">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2">
                              Active
                            </span>
                            <span className="text-sm text-gray-500">
                              Until: {new Date(prescription.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div>
                            <span className="text-gray-500">Dosage:</span> {prescription.dosage}
                            </div>
                            <div>
                            <span className="text-gray-500">Frequency:</span> {prescription.frequency}
                            </div>
                            <div>
                            <span className="text-gray-500">Prescribed by:</span> {prescription.prescribedBy}
                          </div>
                        </div>
                        {prescription.instructions && (
                          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm">
                              <span className="text-gray-500">Instructions:</span> {prescription.instructions}
                            </p>
                        </div>
                        )}
                      </div>
                    ))
                  ) : (
                    medications.map((medication: any, index: number) => (
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
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Request Refill</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
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
                {isLoadingRisks ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Analyzing your health data...</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">This may take a few moments</p>
                    <div className="mt-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                ) : riskError ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                    <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 dark:text-red-400">{riskError}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={fetchHealthRisks}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : riskFactors.length > 0 ? (
                  <div className="space-y-6">
                    {riskFactors.map((factor, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{factor.name}</h3>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              factor.risk === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                              factor.risk === "Moderate" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}>
                              {factor.risk} Risk
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                            <div 
                              className={`h-3 rounded-full ${
                                factor.risk === "High" ? "bg-red-500 dark:bg-red-600" :
                                factor.risk === "Moderate" ? "bg-amber-500 dark:bg-amber-600" :
                                "bg-green-500 dark:bg-green-600"
                              }`}
                              style={{ width: `${factor.score}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
                          <ul className="space-y-2 pl-1">
                            {factor.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start">
                                <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 mt-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                  <span className="text-xs">•</span>
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {factor.lifestyle && (
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Lifestyle Recommendations:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Diet</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{factor.lifestyle.diet}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Exercise</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{factor.lifestyle.exercise}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Habits</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{factor.lifestyle.habits}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Monitoring</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{factor.lifestyle.monitoring}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {factor.metrics && (
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Health Metrics:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Current Values</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{factor.metrics.current}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Target Values</h5>
                                <p className="text-sm text-green-600 dark:text-green-400">{factor.metrics.target}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4">
                      <BarChart3 className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Analyze Your Health Risks</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                      Get personalized health risk assessments based on your medical history and current health metrics.
                    </p>
                    <Button 
                      onClick={fetchHealthRisks} 
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-2 shadow-md"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Analyze Health Risks
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6">
            <AiHealthInsights patientName={patient?.name?.given?.[0] || "John"} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
