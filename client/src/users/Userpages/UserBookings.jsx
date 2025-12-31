import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const UserBookings = () => {
  const { User, loading: userLoading } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user bookings
  const fetchBookings = async () => {
    if (!User || !(User.id || User._id)) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/booking/user/${User.id || User._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setBookings(res.data.bookings);
        console.log("bookings",res.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && (User?.id || User?._id)) {
      fetchBookings();
    }
  }, [User, userLoading]);

  if (userLoading || loading) {
    return (
      <p className="text-gray-500 text-center mt-10 animate-pulse">
        Loading your bookings...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No bookings yet. Book a contractor to get started!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white text-xl font-semibold capitalize">
                    {b.contractor?.name || "Unknown Contractor"}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    {b.contractor?.profession || "N/A"}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full shadow-md ${
                    b.status === "completed"
                      ? "bg-green-500 text-white"
                      : b.status === "cancelled"
                      ? "bg-red-500 text-white"
                      : b.status === "confirmed"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-400 text-gray-900"
                  }`}
                >
                  {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">📞 Phone:</span>{" "}
                  {b.contractor?.phone || "N/A"}
                </p>

                <p className="text-gray-700">
                  <span className="font-medium">📅 Date:</span>{" "}
                  {b.date ? new Date(b.date).toLocaleString() : "N/A"}
                </p>

                <p className="text-gray-700">
                  <span className="font-medium">🕒 Slot:</span> {b.slot || "N/A"}
                </p>

                <p className="text-gray-700">
                  <span className="font-medium">💳 Payment:</span>{" "}
                  {b.paymentStatus
                    ? b.paymentStatus.charAt(0).toUpperCase() +
                      b.paymentStatus.slice(1)
                    : "Unpaid"}
                </p>
              </div>

              {/* Footer */}
              <div className="bg-gray-100 p-4 flex justify-between items-center">
                {/* ★ Correct Amount */}
                <p className="text-lg font-bold text-gray-800">₹{b.amount}</p>

                <button
                  onClick={() => navigate(`/user/bookings/${b._id}`)}
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
