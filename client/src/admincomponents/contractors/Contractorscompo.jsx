import React, { useEffect, useState } from "react";
import axios from "axios";

const Contractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfession, setSelectedProfession] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const professions = [
    "all",
    "Contractor",
    "Material Supplier",
    "Plumber",
    "Electrician",
    "Painter",
    "Mason",
    "Labour",
    "Interior Designer",
    "Architect",
  ];

  // Fetch Contractors
  const fetchContractors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/admin/contractors", {
        withCredentials: true,
      });
      setContractors(res.data.contractors || res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contractors:", error);
      setLoading(false);
    }
  };

  // Toggle block/unblock
  const toggleBlock = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/contractors/${id}/block`,
        {},
        { withCredentials: true }
      );
      fetchContractors();
    } catch (error) {
      console.error("Error blocking/unblocking contractor:", error);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  // ⭐ Filter + Search Logic
  const filteredContractors = contractors.filter((c) => {
    const matchesProfession =
      selectedProfession === "all" || c.profession === selectedProfession;

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    return matchesProfession && matchesSearch;
  });

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide">Workers</h1>
        <p className="text-gray-600">Search and manage all workers here.</p>
      </div>

      {/* ⭐ Search + Filter Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6 bg-gray-50 p-4 rounded-xl shadow-md">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name, Email, Phone..."
          className="flex-1 p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Profession Filter */}
        <select
          className="p-3 border rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-purple-400 outline-none"
          value={selectedProfession}
          onChange={(e) => setSelectedProfession(e.target.value)}
        >
          {professions.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? "All Professions" : p}
            </option>
          ))}
        </select>
      </div>

      {/* Loader */}
      {loading ? (
        <p className="text-gray-500 italic">Loading workers...</p>
      ) : filteredContractors.length === 0 ? (
        <p className="text-gray-500 italic text-center py-10 text-lg">No workers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-2xl shadow-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border text-left">Name</th>
                <th className="px-4 py-3 border text-left">Email</th>
                <th className="px-4 py-3 border text-left">Phone</th>
                <th className="px-4 py-3 border text-left">Profession</th>
                <th className="px-4 py-3 border text-left">Experience</th>
                <th className="px-4 py-3 border text-center">Status</th>
                <th className="px-4 py-3 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredContractors.map((c, index) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50 transition-all border-b"
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2">{c.profession}</td>
                  <td className="px-4 py-2">{c.experienceLevel}</td>

                  {/* Status Badge */}
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        c.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {c.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Block/Unblock Button */}
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleBlock(c._id)}
                      className={`px-4 py-1.5 rounded-lg text-white font-semibold shadow-md transition-all ${
                        c.isBlocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {c.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contractors;
