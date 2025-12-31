// ...existing code...
import React from "react";
import UserSidebar from "../users/Usersidebar";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar (fixed width) */}
      <div className="w-60">
        <UserSidebar />
      </div>

      {/* Main content area (grows to fill space) */}
      <div className="flex-1 min-h-screen transition-all duration-200 ease-in-out">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
// ...existing code...