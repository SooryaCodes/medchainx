import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Appointment from "./pages/Appointment";
import Help from "./pages/Help";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
