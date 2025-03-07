import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("labResults");

  const fakeUserData = {
    medicalTimeline: [
      { date: "2024-03-01", event: "Routine Checkup" },
      { date: "2024-02-20", event: "Blood Test" },
      { date: "2024-01-15", event: "X-Ray Scan" },
    ],
    healthMetrics: { heartRate: 72, bloodPressure: "120/80", weight: "70kg" },
    medicalRecords: {
      labResults: "Blood test results: Normal.",
      diagnosis: "Mild hypertension detected.",
      treatment: "Prescribed lifestyle changes and monitoring.",
    },
    upcomingAppointments: [{ date: "2024-03-10", doctor: "Dr. Smith, Cardiologist" }],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Medical Timeline */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Medical Timeline</h2>
          <ul className="list-disc ml-4">
            {fakeUserData.medicalTimeline.map((event, index) => (
              <li key={index}>{event.date} - {event.event}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Health Metrics</h2>
          <p>Heart Rate: {fakeUserData.healthMetrics.heartRate} bpm</p>
          <p>Blood Pressure: {fakeUserData.healthMetrics.bloodPressure}</p>
          <p>Weight: {fakeUserData.healthMetrics.weight}</p>
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
          <p>{fakeUserData.medicalRecords[activeTab]}</p>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
          <ul className="list-disc ml-4">
            {fakeUserData.upcomingAppointments.map((appointment, index) => (
              <li key={index}>{appointment.date} - {appointment.doctor}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
