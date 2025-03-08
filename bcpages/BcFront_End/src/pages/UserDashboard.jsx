import { useState } from "react";

export default function App() {
  const [userId, setUserId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([
    { id: 1, name: "Blood Test Report", date: "2025-03-07" },
    { id: 2, name: "X-Ray Scan", date: "2025-03-06" },
    { id: 3, name: "MRI Scan", date: "2025-03-05" },
    { id: 4, name: "CT Scan", date: "2025-03-04" },
  ]);

  const handleLogin = () => {
    if (userId) {
      setLoggedIn(true);
    }
  };

  const generateToken = () => {
    const newToken = Math.random().toString(36).substr(2, 8);
    setToken(newToken);
    setTimeout(() => setToken(null), 30 * 60 * 1000); // Expires in 30 min
  };

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
