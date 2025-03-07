import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("labResults");
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/patient/get-patient-by-name/John Doe"); // Replace with dynamic name if needed
        if (!response.ok) throw new Error("Failed to fetch patient data");
        const data = await response.json();
        setPatientData(data.patientRecord);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  if (!patientData) return <p>Loading patient data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Medical Timeline */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Medical Timeline</h2>
          <ul className="list-disc ml-4">
            {patientData.medicalHistory.map((event, index) => (
              <li key={index}>{event.diagnosedOn} - {event.condition}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Health Metrics</h2>
          <p>Heart Rate: {patientData.healthMetrics?.heartRate} bpm</p>
          <p>Blood Pressure: {patientData.healthMetrics?.bloodPressure}</p>
          <p>Weight: {patientData.healthMetrics?.weight}</p>
        </CardContent>
      </Card>

      {/* Medical Records (Switchable) */}
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
          <div className="flex gap-2 mb-3">
            <Button onClick={() => setActiveTab("labResults")}>Lab Results</Button>
            <Button onClick={() => setActiveTab("diagnosis")}>Diagnosis</Button>
            <Button onClick={() => setActiveTab("treatment")}>Treatment</Button>
          </div>
          <p>{patientData.medicalRecords?.[activeTab]}</p>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
          <ul className="list-disc ml-4">
            {patientData.upcomingAppointments?.map((appointment, index) => (
              <li key={index}>{appointment.date} - {appointment.doctor}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
