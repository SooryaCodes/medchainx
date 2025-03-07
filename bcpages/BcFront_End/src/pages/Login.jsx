import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose, setUser, show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const navigate = useNavigate();

  if (!show) return null;

  const handleLogin = () => {
    if (
      (role === "doctor" && username === "doctor" && password === "password") ||
      (role === "patient" && username === "patient" && password === "password")
    ) {
      localStorage.setItem("userRole", role);
      setUser(role);
      onClose();
      navigate(role === "doctor" ? "/DoctorDashboard" : "/UserDashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;