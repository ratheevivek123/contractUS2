import React, { useState } from "react";
import axios from "axios";
import { useContractorList } from "../../context/ContractorListContext.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

/* ---------------------------------------------------------
   ⭐ STAR COMPONENT
--------------------------------------------------------- */
const Star = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.784.57-1.84-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.063 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
  </svg>
);

/* ---------------------------------------------------------
   ⭐ SKELETON CARD (loading)
--------------------------------------------------------- */
const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow p-4 h-56"></div>
);

/* ---------------------------------------------------------
   ⭐ CONTRACTOR CARD
--------------------------------------------------------- */
const ContractorCard = ({ c, onBook, isBookingDisabled }) => {
  const navigate = useNavigate();

  const rating = typeof c.rating === "number" ? c.rating : 4.6;
  const stars = [0, 1, 2, 3, 4].map((i) => i < Math.round(rating));

  const rate =
    typeof c.rate === "object" && c.rate !== null
      ? c.rate.amount
      : c.rate || 500;

  const skills = (c.skills || []).map((s) =>
    typeof s === "object" ? s.name : s
  );

  return (
    <article className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-t-2xl flex items-end">
        <div className="absolute -top-8 left-4">
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow">
            <img
              src={c.avatar || `https://i.pravatar.cc/150?u=${c._id}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="ml-24 text-white">
          <h3 className="text-lg font-semibold">{c.name}</h3>
          <p className="text-sm opacity-90">{c.profession}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col justify-between">
        <p className="text-sm text-gray-600 mb-2">
          {c.bio || "Skilled professional offering trusted services."}
        </p>

        <div className="flex items-center gap-2 text-sm mb-3">
          <div className="flex gap-1">
            {stars.map((filled, i) => (
              <Star key={i} filled={filled} />
            ))}
          </div>
          <span className="text-gray-700 ml-2">{rating.toFixed(1)}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">{c.experienceLevel}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((s, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="text-lg font-semibold text-gray-800">₹{rate}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onBook(c)}
              disabled={isBookingDisabled}
              className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full transition ${
                isBookingDisabled ? "opacity-50" : "hover:scale-105"
              }`}
            >
              {isBookingDisabled ? "Login to Book" : "Book Now"}
            </button>

            <button
              onClick={() => navigate(`/user/contractor/${c._id}`)}
              className="px-3 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ---------------------------------------------------------
   ⭐ MAIN COMPONENT WITH SLOT MODAL
--------------------------------------------------------- */
const FindContractor = () => {
  const { contractors, loading } = useContractorList();
  const { User, loading: userLoading } = useUser();
  const navigate = useNavigate();

  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");

  const slots = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
  ];

  const openSlotModal = (contractor) => {
    if (!User?._id && !User?.id) {
      alert("Please login first!");
      return;
    }
    setSelectedContractor(contractor);
    setSlotModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedSlot) return alert("Please select a slot");

    try {
      const bookingData = {
        user: User.id || User._id,
        contractor: selectedContractor._id,
        date: new Date(),
        slot: selectedSlot,
      };

      const res = await axios.post(
        "http://localhost:3000/api/booking/create",
        bookingData,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Booking Created Successfully!");
        setSlotModalOpen(false);
        setSelectedSlot("");
        setSelectedContractor(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error creating booking");
      console.log(err);
    }
  };

  const isBookingDisabled = userLoading || !User;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-4">Find a trusted contractor</h1>

        {/* Contractor Cards */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(contractors || []).map((c) => (
                <ContractorCard
                  key={c._id}
                  c={c}
                  isBookingDisabled={isBookingDisabled}
                  onBook={openSlotModal}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* SLOT MODAL */}
      {slotModalOpen && selectedContractor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">

            <h2 className="text-xl font-bold mb-3">Select Time Slot</h2>
            <p className="text-gray-700 mb-4">
              Booking for: <b>{selectedContractor.name}</b>
            </p>

            <div className="flex flex-col gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border transition ${
                    selectedSlot === slot
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setSlotModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default FindContractor;
