import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Appointment from "./pages/Appointment";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home redirects to login if not authenticated */}
        <Route path="/" element={<Login />} />

        {/* Dashboards */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        {/* Other Pages */}
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default App;
