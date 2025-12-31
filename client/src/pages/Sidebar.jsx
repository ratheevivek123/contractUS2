import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/admin/logout",
        {},
        { withCredentials: true }
      );
      navigate("/Admin/login");
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };

  const menuItems = [
    { label: "Home", path: "/Admin" },
    { label: "Users", path: "/Admin/users" },
    { label: "Workers", path: "/Admin/contractors" },
    
    { label: "Projects", path: "/Admin/projects" },
    { label: "Leads / Messages", path: "/Admin/leads" },
    { label: "About", path: "/Admin/about" },
  ];

  return (
    <div
      className="
         w-64 h-full flex flex-col justify-between
  bg-[#0d1126]/90 backdrop-blur-2xl border-r border-indigo-400/30
  shadow-[0_0_40px_rgba(99,102,241,0.35)]
  px-6 py-10 select-none
      "
    >
      {/* Logo + Title */}
      <div className="mb-12">
        <h1 className="text-[26px] leading-tight font-extrabold tracking-wide">
          <span className="text-white drop-shadow-lg">ADMIN</span>
          <br />
          <span className="text-indigo-300 drop-shadow-lg">PANEL</span>
        </h1>
        <p className="text-xs text-gray-300 opacity-60 mt-2 tracking-wide">
          Control Center
        </p>
      </div>

      {/* Navigation Menu */}
      <ul className="space-y-3 text-[17px] font-medium">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === "/Admin"}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-xl scale-[1.05]"
                    : "text-gray-300 hover:bg-indigo-500 hover:text-white hover:scale-[1.03]"
                }
              `
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="
          w-full py-2 text-lg mt-10 rounded-lg font-semibold
          bg-gradient-to-r from-red-600 to-pink-600
          text-white shadow-lg hover:shadow-2xl hover:scale-[1.05]
          transition-all duration-300 border border-red-400
        "
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
