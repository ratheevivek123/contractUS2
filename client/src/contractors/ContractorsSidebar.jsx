import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaClipboardList, FaTools, FaUser } from "react-icons/fa";

const ContractorsSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/contractors/logout",
        {},
        { withCredentials: true }
      );
      navigate("/contractor-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 🔹 Sidebar link classes
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 font-semibold
     ${isActive 
       ? "bg-[#ffcc70] text-[#002b45] text-shadow-black" 
       : "text-white hover:bg-[#ffcc70] hover:text-[#002b45] hover:text-shadow-black-hover"}`;

  return (
    <div
      className="fixed top-0 left-0 w-64 h-screen flex flex-col justify-between shadow-xl z-50"
      style={{
        background: "linear-gradient(180deg, #002b45, #004f77)",
      }}
    >
      {/* Logo / Title */}
      <div className="p-6 border-b border-white border-opacity-10">
        <h1 className="text-xl font-extrabold tracking-wide text-white">
          Contractor<span className="text-[#ffcc70]">Pro</span>
        </h1>
        <p className="text-xs text-white text-opacity-70 mt-1">
          Manage your work efficiently
        </p>
      </div>

      {/* Menu */}
      <ul className="flex flex-col p-4 gap-3 text-base">
        <li>
          <NavLink to="/Contractor" end className={linkClasses}>
            <FaHome size={18} />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/Contractor/bookings" className={linkClasses}>
            <FaClipboardList size={18} />
            My Bookings
          </NavLink>
        </li>
        <li>
          <NavLink to="/Contractor/services" className={linkClasses}>
            <FaTools size={18} />
            Manage Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/Contractor/profile" className={linkClasses}>
            <FaUser size={18} />
            Profile
          </NavLink>
        </li>
      </ul>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 text-shadow-black"
          style={{
            background: "linear-gradient(90deg, #ff4d4d, #ff9966)",
            boxShadow: "0 4px 10px rgba(255, 77, 77, 0.4)",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ContractorsSidebar;
