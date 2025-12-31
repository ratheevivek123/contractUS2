import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContractor } from "../context/ContractorContext.jsx";
import toast, { Toaster } from "react-hot-toast";

const GRAD = "linear-gradient(180deg, #002b45, #004f77)";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
    confirmed: "bg-blue-50 text-blue-800 ring-1 ring-blue-200",
    completed: "bg-green-50 text-green-800 ring-1 ring-green-200",
    cancelled: "bg-red-50 text-red-800 ring-1 ring-red-200",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide ${map[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status ? status.toUpperCase() : "PENDING"}
    </span>
  );
};

const ContractorBookings = () => {
  const { contractor, loading: contractorLoading } = useContractor();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (!contractorLoading && contractor?._id) fetchBookings();
  }, [contractor?._id, contractorLoading]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/booking/contractor/${contractor._id}`,
        { withCredentials: true }
      );
      setBookings(res.data.bookings || []);
    } catch (err) {
      toast.error("Unable to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const updateStatus = async (id, status) => {
    if (!confirm(`Change status to "${status}"?`)) return;
    setUpdating((s) => ({ ...s, [id]: true }));
    const prev = bookings;
    setBookings((b) => b.map((x) => (x._id === id ? { ...x, status } : x)));

    try {
      const res = await axios.put(
        `http://localhost:3000/api/booking/update/${id}`,
        { status },
        { withCredentials: true }
      );
      if (!res.data?.success) throw new Error(res.data?.message || "Update failed");
      toast.success(`Booking ${status}`);
    } catch {
      toast.error("Update failed, reverting");
      setBookings(prev);
    } finally {
      setUpdating((s) => ({ ...s, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#f6fbff]">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header
          className="mb-6 rounded-2xl p-6 text-white shadow-lg"
          style={{ background: GRAD }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold">Bookings</h1>
              <p className="text-sm opacity-90 mt-1">
                Manage appointments — confirm, cancel or mark as completed.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchBookings}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm hover:scale-105 transition"
              >
                Refresh
              </button>
              <div className="text-sm px-3 py-2 rounded-full bg-white/10 border border-white/10">
                <span className="font-medium">Contractor</span>
                <div className="text-xs opacity-80">{contractor?.name || "—"}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Cards */}
        {loading || contractorLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-5 shadow-sm h-52" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl shadow-sm">
            <p className="text-slate-600">No bookings yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <article
                key={b._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border flex flex-col hover:shadow-lg transition-all"
                style={{ borderColor: "rgba(0,79,119,0.08)" }}
              >
                {/* Top Section */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ background: GRAD, color: "#fff" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow">
                      <img
                        src={b.user?.avatar || `https://i.pravatar.cc/150?u=${b.user?._id}`}
                        alt={b.user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base leading-tight">
                        {b.user?.name || "User"}
                      </h3>
                      <p className="text-xs text-white/80">{b.user?.email || "—"}</p>
                    </div>
                  </div>

                  <StatusBadge status={b.status} />
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="text-sm text-slate-700 space-y-2">
                    <div>
                      <span className="font-medium">Service:</span>{" "}
                      {b.contractor?.profession || b.slot}
                    </div>
                    <div>
                      <span className="font-medium">Slot:</span> {b.slot || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {b.user?.phone || "—"}
                    </div>
                  </div>

                  {/* Bottom Row with Amount + Date */}
                  <div className="mt-5 flex items-center justify-between border-t pt-3">
                    <div>
                      <p className="text-sm text-slate-500">Amount</p>
                      <p className="text-lg font-semibold text-slate-900">
                        ₹{b.amount || 500}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 text-right">
                      {formatDate(b.date)}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex items-center justify-end gap-2">
                    {b.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(b._id, "confirmed")}
                          disabled={updating[b._id]}
                          className="px-3 py-1 rounded-md bg-[#004f77] text-white text-sm hover:bg-[#003f5f] disabled:opacity-60"
                        >
                          {updating[b._id] ? "..." : "Confirm"}
                        </button>

                        <button
                          onClick={() => updateStatus(b._id, "cancelled")}
                          disabled={updating[b._id]}
                          className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-500 disabled:opacity-60"
                        >
                          {updating[b._id] ? "..." : "Cancel"}
                        </button>
                      </>
                    )}

                    {b.status === "confirmed" && (
                      <button
                        onClick={() => updateStatus(b._id, "completed")}
                        disabled={updating[b._id]}
                        className="px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-500 disabled:opacity-60"
                      >
                        {updating[b._id] ? "..." : "Mark Done"}
                      </button>
                    )}

                    {(b.status === "completed" || b.status === "cancelled") && (
                      <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm cursor-not-allowed">
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorBookings;
