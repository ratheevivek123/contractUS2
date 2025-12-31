import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useUser } from "../context/UserContext.jsx";

const UserSidebar = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/user-login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div
     className="fixed top-0 left-0 w-64 h-screen flex flex-col justify-between shadow-xl z-50"
  style={{
    background: "linear-gradient(to bottom, #f9f9ff, #f0f4ff)", // light gradient background
  }}
    >
      {/* Brand / Logo */}
      <div className="p-6 border-b border-gray-200/70">
        <h1 className="text-2xl font-extrabold tracking-wide text-purple-600">
          Contract<span className="text-blue-500">Us</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Smart Booking Platform
        </p>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col p-4 gap-3 text-base font-medium">
        <li>
          <NavLink
            to="/user"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <FaHome size={18} />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user/bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <FaClipboardList size={18} />
            Booking
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user/find-contractor"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <FaUsers size={18} />
            Contractors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <FaUser size={18} />
            Profile
          </NavLink>
        </li>
      </ul>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200/70">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-2 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:opacity-90"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
          }}
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
