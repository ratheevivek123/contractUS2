// src/pages/Suppliers.jsx
import React from "react";

const Supplierscompo= () => {
  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">

      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      <p className="text-gray-700">Manage supplier information here.</p>

      {/* Placeholder for supplier list */}
      <div className="mt-6 border rounded p-4 bg-white shadow">
        <p className="text-gray-500 italic">Supplier list will appear here...</p>
      </div>
    </div>
  );
};

export default Supplierscompo;
