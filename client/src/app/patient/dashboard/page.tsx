"use client";

import { useState } from "react";
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
  PieChart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MedicalHistoryList } from "@/components/features/medical-history/MedicalHistoryList";
import { MedicalRecordDetail } from "@/components/features/medical-history/MedicalRecordDetail";

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

// Mock data for the dashboard
const healthMetrics = {
  heartRate: { current: 72, min: 65, max: 80, trend: { value: 2, isPositive: false } },
  bloodPressure: { systolic: 120, diastolic: 80, trend: { value: 5, isPositive: true } },
  temperature: { current: 98.6, min: 97.8, max: 99.1, trend: { value: 0.2, isPositive: false } },
  oxygenLevel: { current: 98, min: 95, max: 100, trend: { value: 1, isPositive: true } },
  weight: { current: 165, target: 160, trend: { value: 2, isPositive: true } }
};

const medicalHistory = [
  { date: "2023-12-15", type: "Checkup", description: "Annual physical examination", doctor: "Dr. Smith", notes: "All vitals normal, recommended regular exercise" },
  { date: "2023-10-03", type: "Vaccination", description: "Flu shot", doctor: "Dr. Johnson", notes: "No adverse reactions" },
  { date: "2023-07-22", type: "Specialist", description: "Cardiology consultation", doctor: "Dr. Williams", notes: "ECG normal, recommended diet changes" },
  { date: "2023-05-10", type: "Emergency", description: "Acute bronchitis", doctor: "Dr. Brown", notes: "Prescribed antibiotics for 7 days" },
  { date: "2023-02-18", type: "Surgery", description: "Appendectomy", doctor: "Dr. Davis", notes: "Successful procedure, follow-up in 2 weeks" }
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

// Mock data for charts (we would use a real chart library in production)
const mockChartData = {
  heartRate: [68, 72, 70, 74, 71, 73, 72],
  bloodPressure: {
    systolic: [118, 122, 120, 125, 119, 121, 120],
    diastolic: [78, 82, 80, 83, 79, 81, 80]
  },
  weight: [168, 167, 166, 166, 165, 165, 165],
  bloodSugar: {
    fasting: [95, 98, 92, 97, 94, 96, 95],
    afterMeal: [100, 105, 98, 102, 99, 101, 100]
  },
  cholesterol: {
    total: [200, 210, 195, 205, 198, 202, 197]
  },
  sleepQuality: {
    hours: [7, 7.5, 6.8, 8, 7.2, 7.8, 7.5]
  },
  medicationAdherence: {
    "lisinopril": [true, true, true, true, true, true, true],
    "atorvastatin": [true, true, true, true, true, true, true],
    "metformin": [true, true, true, true, true, true, true]
  }
};

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedMedicalRecord(record);
  };

  const handleCloseRecord = () => {
    setSelectedMedicalRecord(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 -z-10" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] -z-10" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Patient Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome back, John Doe</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 px-3 py-1.5 rounded-full">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-primary">Connected to Health Services</span>
            </div>
            <Button variant="outline" size="sm" className="ml-2">
              <User className="h-4 w-4 mr-1" /> Profile
            </Button>
          </div>
        </div>
        
        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Health Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Heart Rate"
                value={`${healthMetrics.heartRate.current} BPM`}
                icon={<Heart className="h-5 w-5" />}
                description={`Range: ${healthMetrics.heartRate.min}-${healthMetrics.heartRate.max} BPM`}
                trend={healthMetrics.heartRate.trend}
              />
              <DashboardCard
                title="Blood Pressure"
                value={`${healthMetrics.bloodPressure.systolic}/${healthMetrics.bloodPressure.diastolic}`}
                icon={<Activity className="h-5 w-5" />}
                description="Systolic/Diastolic (mmHg)"
                trend={healthMetrics.bloodPressure.trend}
              />
              <DashboardCard
                title="Temperature"
                value={`${healthMetrics.temperature.current}°F`}
                icon={<Thermometer className="h-5 w-5" />}
                description={`Range: ${healthMetrics.temperature.min}-${healthMetrics.temperature.max}°F`}
                trend={healthMetrics.temperature.trend}
              />
              <DashboardCard
                title="Oxygen Level"
                value={`${healthMetrics.oxygenLevel.current}%`}
                icon={<Droplet className="h-5 w-5" />}
                description={`Range: ${healthMetrics.oxygenLevel.min}-${healthMetrics.oxygenLevel.max}%`}
                trend={healthMetrics.oxygenLevel.trend}
              />
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Heart Rate Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Heart Rate Trends</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-end justify-between gap-2">
                    {mockChartData.heartRate.map((value, index) => (
                      <div key={index} className="relative h-full flex flex-col justify-end items-center">
                        <div 
                          className="w-10 bg-blue-500 rounded-t-md"
                          style={{ height: `${(value / 100) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Average: {mockChartData.heartRate.reduce((a, b) => a + b, 0) / mockChartData.heartRate.length} BPM
                </CardFooter>
              </Card>
              
              {/* Blood Pressure Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Blood Pressure Trends</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-end justify-between gap-2">
                    {mockChartData.bloodPressure.systolic.map((value, index) => (
                      <div key={index} className="relative h-full flex flex-col justify-end items-center">
                        <div className="flex flex-col gap-0.5">
                          <div 
                            className="w-10 bg-red-500 rounded-t-md"
                            style={{ height: `${(value / 200) * 100}%` }}
                          ></div>
                          <div 
                            className="w-10 bg-blue-500 rounded-b-md"
                            style={{ height: `${(mockChartData.bloodPressure.diastolic[index] / 200) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs mt-1 text-gray-500">{`Day ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500 flex justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span>Systolic</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Diastolic</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{appointment.type} with {appointment.doctor}</h4>
                          <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">{appointment.location}</span>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Appointments</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Medical History Tab - Enhanced with detailed view */}
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
                        <div>
                          <h4 className="font-semibold text-lg">{medication.name}</h4>
                          <p className="text-sm text-gray-500">
                            {medication.dosage} • {medication.frequency} • For {medication.purpose}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm">
                          Refill by: {medication.refillDate}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span>Adherence</span>
                          <span className="font-medium">{medication.adherence}%</span>
                        </div>
                        <Progress 
                          value={medication.adherence} 
                          className={`h-2 ${
                            medication.adherence > 90 ? 'bg-green-100 [&>div]:bg-green-500' :
                            medication.adherence > 75 ? 'bg-yellow-100 [&>div]:bg-yellow-500' :
                            'bg-red-100 [&>div]:bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  Request Refill
                </Button>
                <Button variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                  Add Medication
                </Button>
              </CardFooter>
            </Card>
            
            {/* Medication Adherence Chart */}
            <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Medication Adherence
                </CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {medications.map((medication, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{medication.name}</span>
                        <span className="text-sm text-gray-500">{medication.adherence}% adherence</span>
                      </div>
                      <div className="flex gap-2">
                        {mockChartData.medicationAdherence[medication.name.toLowerCase() as keyof typeof mockChartData.medicationAdherence]?.map((taken: boolean, i: number) => (
                          <div 
                            key={i} 
                            className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                              taken 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {taken ? 'Taken' : 'Missed'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Risk Assessment Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                  Health Risk Assessment
                </CardTitle>
                <CardDescription>
                  Based on your medical history, lifestyle, and genetic factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {riskFactors.map((risk, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h4 className="font-semibold text-lg">{risk.name}</h4>
                        <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                          risk.risk === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          risk.risk === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {risk.risk} Risk
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span>Risk Score</span>
                            <span className="font-medium">{risk.score}/100</span>
                          </div>
                          <Progress 
                            value={risk.score} 
                            className={`h-2 ${
                              risk.score > 70 ? 'bg-red-100 [&>div]:bg-red-500' :
                              risk.score > 40 ? 'bg-yellow-100 [&>div]:bg-yellow-500' :
                              'bg-green-100 [&>div]:bg-green-500'
                            }`} 
                          />
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm mb-2">Recommendations:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {risk.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  Schedule Risk Assessment Consultation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
