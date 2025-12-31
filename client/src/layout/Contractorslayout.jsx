import React from 'react';
import { Outlet } from 'react-router-dom';
import ContractorsSidebar from '../contractors/ContractorsSidebar';


const Contractorslayout= () =>  {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar Placeholder */}
      <div
        className="hidden md:block w-60 bg-white shadow-md h-screen fixed left-0 top-0 z-20"
        id="contractor-sidebar"
      >
        <ContractorsSidebar />
      </div>

      {/* Main Area */}
      <div
        className="flex-1 min-h-screen transition-all duration-200 ease-in-out"
        style={{ marginLeft: "15rem" }} // 15rem = w-60
      >
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Contractorslayout
;
