import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Appointment from "./pages/Appointment";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import BlockchainView from "./pages/BlockchainView"; // Import the new component

const UserDashboardWrapper = () => {
  const { userId } = useParams();
  return <UserDashboard userId={userId} />;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<Login />} />
      <Route path="/user-dashboard/:userId" element={<UserDashboardWrapper />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/help" element={<Help />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/blockchain" element={<BlockchainView />} /> {/* Add the new route */}
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
};

export default App;