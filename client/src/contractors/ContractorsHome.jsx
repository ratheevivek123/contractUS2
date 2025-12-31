import React, { useEffect, useState } from "react";
import axios from "axios";

const ContractorHome = () => {
  const [stats, setStats] = useState({
    totalCompleted: 0,
    ongoing: 0,
    cancelled: 0,
    earnings: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch contractor info (from token)
  const fetchContractorData = async () => {
    try {
      setLoading(true);
      const contractorRes = await axios.get("http://localhost:3000/api/contractors/token", {
        withCredentials: true,
      });

      const contractor = contractorRes.data.contractor;
      console.log("Logged-in contractor:", contractor);

      // Fetch contractor bookings
      const bookingsRes = await axios.get(
        `http://localhost:3000/api/booking/contractor/${contractor._id}`,
        { withCredentials: true }
        
      );

      const bookings = bookingsRes.data.bookings;

      // Calculate stats
      const totalCompleted = bookings.filter(b => b.status.toLowerCase() === "completed").length;
      const cancelled = bookings.filter(b => b.status.toLowerCase() === "cancelled").length;
      const ongoing = bookings.filter(
        b => b.status.toLowerCase() === "pending" || b.status.toLowerCase() === "confirmed"
      ).length;
      const earnings = bookings
        .filter(b => b.status.toLowerCase() === "completed")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

      setStats({ totalCompleted, ongoing, cancelled, earnings });

      // Sort by latest date and take last 5 bookings
      const recent = bookings
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecentBookings(recent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractorData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full overflow-y-auto">

      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Contractor Dashboard
      </h1>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition text-center">
          <h2 className="text-gray-600 font-semibold">Total Jobs Completed</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.totalCompleted}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition text-center">
          <h2 className="text-gray-600 font-semibold">Ongoing Jobs</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.ongoing}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition text-center">
          <h2 className="text-gray-600 font-semibold">Cancelled Jobs</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.cancelled}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition text-center">
          <h2 className="text-gray-600 font-semibold">Total Earnings</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            ₹{stats.earnings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs md:text-sm">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium">{booking.user?.name}</td>
                  <td className="py-3 px-4 text-gray-600">{new Date(booking.date).toLocaleDateString()}</td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      booking.status.toLowerCase() === "completed"
                        ? "text-green-600"
                        : booking.status.toLowerCase() === "cancelled"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {booking.status}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    ₹{booking.amount?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractorHome;
