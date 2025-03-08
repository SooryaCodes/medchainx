import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

function UserDashboard({ userId }) {
  const [activeTab, setActiveTab] = useState("labResults");
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing");
      setIsLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        // Consider using a more RESTful endpoint like `/api/patients/${userId}`
        const response = await fetch(`http://localhost:3000/api/patient/get-patient-by-name/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch patient data: ${response.status}`);
        }
        
        const data = await response.json();
        setPatientData(data.patientRecord);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Failed to load patient data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [userId]);

  if (isLoading) return <p>Loading patient data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!patientData) return <p>No patient data found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Medical Timeline */}
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Medical Timeline</h2>
          {patientData.medicalHistory && patientData.medicalHistory.length > 0 ? (
            <ul className="list-disc ml-4">
              {patientData.medicalHistory.map((event, index) => (
                <li key={index}>{event.diagnosedOn} - {event.condition}</li>
              ))}
            </ul>
          ) : (
            <p>No medical history available</p>
          )}
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Health Metrics</h2>
          {patientData.healthMetrics ? (
            <>
              <p>Heart Rate: {patientData.healthMetrics.heartRate || 'N/A'} bpm</p>
              <p>Blood Pressure: {patientData.healthMetrics.bloodPressure || 'N/A'}</p>
              <p>Weight: {patientData.healthMetrics.weight || 'N/A'}</p>
            </>
          ) : (
            <p>No health metrics available</p>
          )}
        </CardContent>
      </Card>

      {/* Medical Records (Switchable) */}
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <Button 
              variant={activeTab === "labResults" ? "default" : "outline"}
              onClick={() => setActiveTab("labResults")}
            >
              Lab Results
            </Button>
            <Button 
              variant={activeTab === "diagnosis" ? "default" : "outline"}
              onClick={() => setActiveTab("diagnosis")}
            >
              Diagnosis
            </Button>
            <Button 
              variant={activeTab === "treatment" ? "default" : "outline"}
              onClick={() => setActiveTab("treatment")}
            >
              Treatment
            </Button>
            <Button 
              variant={activeTab === "medicalHistory" ? "default" : "outline"}
              onClick={() => setActiveTab("medicalHistory")}
            >
              Medical History
            </Button>
          </div>
          
          {activeTab === "medicalHistory" ? (
            patientData.medicalHistory && patientData.medicalHistory.length > 0 ? (
              <ul className="list-disc ml-4">
                {patientData.medicalHistory.map((event, index) => (
                  <li key={index}>{event.diagnosedOn} - {event.condition}</li>
                ))}
              </ul>
            ) : (
              <p>No medical history available</p>
            )
          ) : (
            <p>{patientData.medicalRecords?.[activeTab] || `No ${activeTab} information available`}</p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
          {patientData.upcomingAppointments && patientData.upcomingAppointments.length > 0 ? (
            <ul className="list-disc ml-4">
              {patientData.upcomingAppointments.map((appointment, index) => (
                <li key={index}>{appointment.date} - {appointment.doctor}</li>
              ))}
            </ul>
          ) : (
            <p>No upcoming appointments</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDashboard;