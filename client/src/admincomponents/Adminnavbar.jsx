const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-white text-sm">Welcome, Admin</span>
        <button className="bg-white text-purple-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
