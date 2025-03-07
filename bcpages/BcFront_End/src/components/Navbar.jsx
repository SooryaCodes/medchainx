import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Login from "../pages/Login"; // Ensure path is correct

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* Hamburger Menu Button */}
        <button onClick={toggleSidebar} className="text-gray-600">
          {sidebarOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Brand Title */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          MedChainX
        </Link>

        {/* Login Button */}
        <button
          onClick={openLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg">
          <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-600">
            <FiX size={28} />
          </button>
          <div className="mt-16 flex flex-col space-y-4 p-6">
            <Link to="/" className="text-gray-700 hover:text-blue-500" onClick={toggleSidebar}>
              Home
            </Link>
            <Link to="/appointment" className="text-gray-700 hover:text-blue-500" onClick={toggleSidebar}>
              Appointment
            </Link>
            <Link to="/help" className="text-gray-700 hover:text-blue-500" onClick={toggleSidebar}>
              Help
            </Link>
          </div>
        </div>
      )}

      {/* Overlay to Close Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-40" onClick={toggleSidebar}></div>}

      {/* Login Modal */}
      {loginOpen && <Login onClose={closeLogin} />}
    </>
  );
};

export default Navbar;
