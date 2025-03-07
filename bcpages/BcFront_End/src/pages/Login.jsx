// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [role, setRole] = useState("patient");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (role === "doctor") {
            navigate("/doctor-dashboard");
        } else {
            navigate("/user-dashboard");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="p-6 bg-white rounded shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                <select 
                    className="w-full p-2 border rounded mb-4"
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>
                <button 
                    className="w-full bg-blue-500 text-white py-2 rounded"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;