import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  const userId = "john-doe"; // Replace with dynamic user ID

  return (
    <Router>
      <Routes>
        <Route path="/user-dashboard" element={<UserDashboard userId={userId} />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};
const UserDashboard = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("labResults");
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/patient/get-patient-by-name/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch patient data");
        const data = await response.json();
        setPatientData(data.patientRecord);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [userId]);

  if (!patientData) return <p>Loading patient data...</p>;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {!loggedIn ? (
        <div className="p-6 bg-white shadow-md rounded-lg text-center w-80">
          <h2 className="text-xl font-bold mb-4">Patient Login</h2>
          <input
            type="text"
            placeholder="Enter User ID"
            className="w-full p-2 border rounded mb-4"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </div>
      ) : (
        <div className="p-6 bg-white shadow-md rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Patient Dashboard</h2>
          <button onClick={generateToken} className="bg-green-500 text-white px-4 py-2 rounded mb-4 w-full">
            Generate Access Token
          </button>
          {token && <p className="text-sm text-gray-600">Token: {token}</p>}

          <h3 className="text-lg font-bold mt-4 mb-2">Medical Records</h3>
          <div className="space-y-2">
            {medicalRecords.map((record) => (
              <div key={record.id} className="p-2 border rounded bg-gray-50 flex justify-between">
                <span>{record.name}</span>
                <span className="text-gray-500 text-sm">{record.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
