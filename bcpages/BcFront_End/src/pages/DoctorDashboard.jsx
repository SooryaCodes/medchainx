import { useState } from "react";

export default function DoctorDashboard() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("lab");

  const fakePatientData = {
    name: "John Doe",
    age: 45,
    timeline: ["Checkup - Jan 2024", "X-Ray - Feb 2024", "Prescription - Mar 2024"],
    healthMetrics: { bp: "120/80", sugar: "90 mg/dL", heartRate: "72 bpm" },
    medicalRecords: {
      lab: ["Blood Test - Normal", "MRI Scan - Clear"],
      diagnosis: ["Hypertension"],
      treatment: ["Medication - Amlodipine"],
    },
    appointments: ["March 10, 2025 - 10:30 AM", "April 5, 2025 - 2:00 PM"],
  };

  const handleAuth = () => {
    if (token === "token123") setIsAuthorized(true);
    else alert("Invalid Token");
  };

  return (
    <div className="p-6 space-y-4">
      {!isAuthorized ? (
        <div className="flex flex-col items-center">
          <input
            type="password"
            placeholder="Enter Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-64 p-2 border rounded-md"
          />
          <button
            onClick={handleAuth}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Authenticate
          </button>
        </div>
      ) : (
        <>
          {/* Patient Info */}
          <div className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-xl font-bold">
              {fakePatientData.name}, {fakePatientData.age}
            </h2>
            <p className="text-gray-500">Medical Timeline</p>
            <ul className="list-disc ml-4">
              {fakePatientData.timeline.map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          </div>

          {/* Health Metrics */}
          <div className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-xl font-bold">Health Metrics</h2>
            <p>Blood Pressure: {fakePatientData.healthMetrics.bp}</p>
            <p>Blood Sugar: {fakePatientData.healthMetrics.sugar}</p>
            <p>Heart Rate: {fakePatientData.healthMetrics.heartRate}</p>
          </div>

          {/* Tab Section */}
          <div className="bg-white shadow-md p-4 rounded-md">
            <div className="flex gap-4 mb-2">
              {["lab", "diagnosis", "treatment"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <ul className="list-disc ml-4">
              {fakePatientData.medicalRecords[activeTab].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Appointments */}
          <div className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-xl font-bold">Upcoming Appointments</h2>
            <ul className="list-disc ml-4">
              {fakePatientData.appointments.map((appt, index) => (
                <li key={index}>{appt}</li>
              ))}
            </ul>
          </div>

          {/* Prescription */}
          <div className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-xl font-bold">Prescription</h2>
            <input
              type="text"
              placeholder="Enter Prescription"
              className="w-full p-2 border rounded-md"
            />
            <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Save Prescription
            </button>
          </div>
        </>
      )}
    </div>
  );
}
