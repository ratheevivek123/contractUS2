
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";

const StatCard = ({ title, value, accent }) => (
  <div className="bg-white shadow-sm rounded-2xl p-4 flex flex-col">
    <div className={`text-xs font-semibold ${accent} mb-2`}>{title}</div>
    <div className="text-2xl font-extrabold text-gray-900">{value}</div>
  </div>
);

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl p-4 h-28" />
);

const BookingRow = ({ b, onView }) => {
  const dateText = b.date ? new Date(b.date).toLocaleString() : "TBD";
  const statusColor =
    b.status === "completed" ? "bg-green-100 text-green-800" :
    b.status === "cancelled" ? "bg-red-100 text-red-800" :
    "bg-yellow-100 text-yellow-800";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={b.contractor?.avatar || `https://i.pravatar.cc/150?u=${b.contractor?._id || b.contractor}`}
            alt={b.contractor?.name || "Contractor"}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-sm text-gray-500">With</div>
          <div className="text-md font-semibold text-gray-900">{b.contractor?.name || "Unknown Contractor"}</div>
          <div className="text-xs text-gray-500 mt-1">{b.contractor?.profession || b.slot}</div>
        </div>
      </div>

      <div className="flex-1 text-right">
        <div className="text-sm text-gray-500">{dateText}</div>
        <div className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {(b.status || "pending").toUpperCase()}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-sm text-gray-500">₹{b.amount || 500}</div>
        <button
          onClick={() => onView(b)}
          className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm"
        >
          View
        </button>
      </div>
    </div>
  );
};

const UserHome = () => {
  const { User, loading: userLoading } = useUser();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserBookings = async () => {
    if (!User?._id) {
      setBookings([]);
      setStats({ total: 0, confirmed: 0, completed: 0, cancelled: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/booking/user/${User._id}`, {
        withCredentials: true,
      });
      const allBookings = res.data?.bookings || [];
      setBookings(allBookings);

      const confirmed = allBookings.filter((b) => b.status === "confirmed").length;
      const completed = allBookings.filter((b) => b.status === "completed").length;
      const cancelled = allBookings.filter((b) => b.status === "cancelled").length;

      setStats({
        total: allBookings.length,
        confirmed,
        completed,
        cancelled,
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setStats({ total: 0, confirmed: 0, completed: 0, cancelled: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) fetchUserBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [User, userLoading]);

  const recent = bookings.slice(0, 3);

  const handleView = (b) => {
    // navigate to booking details page (implement route) or open modal
    navigate(`/user/bookings/${b._id}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Welcome back, {User?.name || "User"} 👋
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quick overview of your bookings and recent activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchUserBookings()}
              className="px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/user/bookings")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm"
            >
              View All Bookings
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard title="Total Bookings" value={loading ? "—" : stats.total} accent="text-indigo-600" />
            <StatCard title="Confirmed" value={loading ? "—" : stats.confirmed} accent="text-blue-600" />
            <StatCard title="Completed" value={loading ? "—" : stats.completed} accent="text-green-600" />
            <StatCard title="Cancelled" value={loading ? "—" : stats.cancelled} accent="text-red-600" />
          </div>

          <div className="hidden md:flex md:flex-col md:items-end">
            <div className="bg-white rounded-2xl p-4 shadow-sm w-full">
              <div className="text-sm text-gray-500">Profile completeness</div>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${( (User?.phone ? 1 : 0) + (User?.address ? 1 : 0) ) / 2 * 100}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <div>{(!User?.phone || !User?.address) ? "Complete profile for better matches" : "Profile complete"}</div>
                <button
                  onClick={() => navigate("/user/profile")}
                  className="text-sm text-indigo-600 font-medium"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <button
              onClick={() => navigate("/user/find-contractor")}
              className="text-sm text-indigo-600 hover:underline"
            >
              Book a Contractor
            </button>
          </div>

          {userLoading || loading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : recent.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600 mb-4">You have no recent bookings.</p>
              <button
                onClick={() => navigate("/find-contractors")}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full"
              >
                Find Contractors
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((b) => (
                <BookingRow key={b._id} b={b} onView={handleView} />
              ))}
            </div>
          )}
        </section>

        {(!User?.phone || !User?.address) && (
          <section className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-md font-semibold text-gray-900">Complete your profile</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Adding contact details helps contractors reach you faster and improves recommendations.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/user/profile")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default UserHome;
// ...existing code...