import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0d1126]">

      {/* Sidebar (static, not fixed) */}
      <Sidebar />

      {/* Main content (scrollable) */}
      <main className="flex-1 h-full 
       overflow-y-auto p-8 bg-gradient-to-r from-[#0d1126] to-[#1b1f34] text-black">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
