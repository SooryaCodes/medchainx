import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose }) => {
    const [role, setRole] = useState("patient");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (role === "doctor") {
            navigate("/doctor-dashboard/"+data[0].id);
        } else {
            navigate("/user-dashboard");
        }
        
        onClose(); // Close the modal after navigating
    };

    // Closes modal when clicking outside
    const handleOverlayClick = (e) => {
        if (e.target.id === "login-modal") onClose();
    };

    return (
        <div 
            id="login-modal"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={handleOverlayClick}
        >
            <div className="p-6 bg-white rounded shadow-md w-80 relative animate-fade-in">
                {/* Close button */}
                <button 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    ✕
                </button>
                
                <h2 className="text-xl font-semibold mb-4">Enter</h2>
                <select 
                    className="w-full p-2 border rounded mb-4"
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>
                <button 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    onClick={handleLogin}
                >
                    Enter
                </button>
            </div>
        </div>
    );
};

export default Login;
