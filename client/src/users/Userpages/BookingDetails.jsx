import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/booking/${bookingId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <p className="text-center mt-10 animate-pulse">Loading...</p>;
  if (!booking) return <p className="text-center mt-10 text-red-500">Booking not found!</p>;

  const c = booking.contractor || {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Booking Details</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-2xl font-semibold mb-2">{c.name || "Unknown Contractor"}</h3>
        <p className="text-gray-600 mb-4">{c.profession || "N/A"}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <p><span className="font-medium">📞 Phone:</span> {c.phone || "N/A"}</p>
          <p><span className="font-medium">📧 Email:</span> {c.email || "N/A"}</p>
          <p><span className="font-medium">📅 Date:</span> {booking.date ? new Date(booking.date).toLocaleString() : "N/A"}</p>
          <p><span className="font-medium">🕒 Slot:</span> {booking.slot || "N/A"}</p>
          <p><span className="font-medium">💳 Payment:</span> {booking.paymentStatus || "Unpaid"}</p>
          <p><span className="font-medium">💰 Amount:</span> ₹{booking.amount || 500}</p>
          <p><span className="font-medium">Status:</span> {booking.status}</p>
        </div>

        <p className="text-gray-700">{c.bio || "No bio available."}</p>
      </div>
    </div>
  );
};

export default BookingDetails;
