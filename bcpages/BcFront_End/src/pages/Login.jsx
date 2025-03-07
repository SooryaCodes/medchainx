import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [role, setRole] = useState("user");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userRole", role);
    navigate(role === "user" ? "/user-dashboard" : "/doctor-dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          {role === "user" ? "User Login" : "Doctor Login"}
        </h2>

        {/* Role Selection */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setRole("user")}
            className={`px-4 py-2 rounded-full transition ${
              role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("doctor")}
            className={`px-4 py-2 rounded-full transition ${
              role === "doctor"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Doctor
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
