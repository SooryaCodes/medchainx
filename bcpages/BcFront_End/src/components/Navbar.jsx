import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import Login from "../pages/Login"; // Ensure correct path

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("userRole") || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("userRole"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* Hamburger Menu - Always Visible */}
        <button onClick={toggleSidebar} className="text-gray-600">
          {sidebarOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          MedChainX
        </Link>

        {/* User Profile / Login */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="text-gray-600">
                <FiUser size={24} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg p-2">
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar (Hamburger Menu) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-600">
          <FiX size={28} />
        </button>

        <div className="mt-16 flex flex-col space-y-4 p-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500" onClick={toggleSidebar}>
            Dashboard
          </Link>
          <Link to="/appointment" className="text-gray-700 hover:text-blue-500" onClick={toggleSidebar}>
            Appointment
          </Link>
          <Link to="/help" className="text-gray-700 hover:text-blue-500" onClick={toggleSidebar}>
            Help
          </Link>
        </div>
      </div>

      {/* Overlay to Close Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-40" onClick={toggleSidebar}></div>}

      {/* Login Popup */}
      {loginOpen && <Login onClose={closeLogin} setUser={setUser} />}
    </>
  );
};

export default Navbar;
