import React, { useEffect, useState } from "react";
import axios from "axios";

const Projects = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/booking/all");
      setBookings(res.data.bookings);
      setFilteredBookings(res.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Apply Filters
  useEffect(() => {
    let data = bookings;

    // Search
    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      data = data.filter(
        (b) =>
          b.user?.name?.toLowerCase().includes(lower) ||
          b.contractor?.name?.toLowerCase().includes(lower) ||
          b.contractor?.profession?.toLowerCase().includes(lower)
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      data = data.filter((b) => b.status === statusFilter);
    }

    // Date Filter
    if (dateFilter !== "") {
      data = data.filter(
        (b) =>
          new Date(b.date).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    setFilteredBookings(data);
  }, [search, statusFilter, dateFilter, bookings]);

  // Update Status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/booking/update/${id}`, {
        status: newStatus,
      });
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete Booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/booking/delete/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl">

      <h1 className="text-3xl font-bold mb-3">Projects</h1>
      <p className="text-gray-300 mb-6">Manage and track all project bookings.</p>

      {/* Container */}
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-lg">

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">

          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, contractor, profession…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 px-4 py-2 rounded-lg bg-white/80 text-black border border-black outline-none"
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/80 text-black border border-black outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/80 text-black border border-black outline-none"
          />

          {/* Clear Filters */}
          {(search || statusFilter !== "all" || dateFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden text-black shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Contractor</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id} className="border hover:bg-gray-100 transition">

                  <td className="p-3 border">{b.user?.name}</td>

                  <td className="p-3 border">
                    {b.contractor?.name} ({b.contractor?.profession})
                  </td>

                  <td className="p-3 border">
                    {new Date(b.date).toLocaleDateString()}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          b.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : b.status === "confirmed"
                            ? "bg-blue-200 text-blue-800"
                            : b.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 border">
                    <div className="flex gap-2 flex-wrap">

                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() => updateStatus(b._id, "confirmed")}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => updateStatus(b._id, "completed")}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => updateStatus(b._id, "cancelled")}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => deleteBooking(b._id)}
                        className="px-3 py-1 bg-red-800 text-white rounded-lg hover:bg-red-900"
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-black shadow-lg w-[400px]">
            <h2 className="text-2xl font-bold mb-3">Booking Details</h2>

            <p><b>User:</b> {selectedBooking.user?.name}</p>
            <p><b>Email:</b> {selectedBooking.user?.email}</p>
            <p><b>Contractor:</b> {selectedBooking.contractor?.name}</p>
            <p><b>Profession:</b> {selectedBooking.contractor?.profession}</p>
            <p><b>Status:</b> {selectedBooking.status}</p>
            <p><b>Date:</b> {new Date(selectedBooking.date).toLocaleString()}</p>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-5 w-full bg-red-600 py-2 rounded-lg text-white hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Projects;
