import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UserProfile = () => {
  const { User, setUser } = useUser();

  const [form, setForm] = useState({
    phone: "",
    address: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔁 Fill form when user loads
  useEffect(() => {
    if (User) {
      setForm({
        phone: User.phone || "",
        address: User.address || "",
        pincode: User.pincode || "",
      });
    }
  }, [User]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.phone || !form.address || !form.pincode) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.patch(
        "http://localhost:3000/api/auth/update-profile",
        {
          phone: form.phone,
          address: form.address,
          pincode: form.pincode,
        },
        { withCredentials: true }
      );

      // ✅ backend success check
      toast.success("Profile updated successfully!");

      // 🔥 Update user in context
      setUser((prev) => ({
        ...prev,
        phone: form.phone,
        address: form.address,
        pincode: form.pincode,
        profileCompleted: true,
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!User) {
    return <p className="text-gray-500 italic">Loading profile...</p>;
  }

  return (
   <div className="max-w-5xl w-full mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">
        My Profile
      </h1>

      {/* 📄 PROFILE INFO */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-8">
        <div className="grid sm:grid-cols-2 gap-4 text-gray-800">
          <p>
            <span className="font-semibold text-gray-600">Name:</span>{" "}
            {User.name}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Email:</span>{" "}
            {User.email}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Phone:</span>{" "}
            {User.phone || "Not added"}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Address:</span>{" "}
            {User.address || "Not added"}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Pincode:</span>{" "}
            {User.pincode || "Not added"}
          </p>
        </div>
      </div>

      {/* ✏️ UPDATE FORM */}
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Update Profile
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300"
        />

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          rows="3"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 md:col-span-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
