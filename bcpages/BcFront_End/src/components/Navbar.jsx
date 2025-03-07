import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login state from localStorage
    const storedUser = localStorage.getItem("userRole");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-white">
          MedChainX
        </Link>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Dashboard</Link>
          <Link to="/appointment" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Appointment</Link>
          <Link to="/help" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">Help</Link>
        </div>

        {/* Dark Mode & Login/Logout */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {/* Login / Logout Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-gray-600 dark:text-gray-300">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col mt-4 space-y-2 bg-gray-100 dark:bg-gray-800 p-4">
          <Link to="/" className="text-gray-700 dark:text-gray-300">Dashboard</Link>
          <Link to="/appointment" className="text-gray-700 dark:text-gray-300">Appointment</Link>
          <Link to="/help" className="text-gray-700 dark:text-gray-300">Help</Link>
          {user ? (
            <button onClick={handleLogout} className="text-red-500">Logout</button>
          ) : (
            <Link to="/login" className="text-blue-500">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
