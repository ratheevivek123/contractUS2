import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeOwnerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Registration successful!");
      navigate("/user-login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-700 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 max-w-xl w-full"
      >
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
          Home Owner Registration
        </h1>

        <div className="grid grid-cols-1 gap-4">

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create Password"
            className="w-full p-3 border rounded-lg"
            required
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold mt-6"
        >
          Register
        </button>

        {/* GOOGLE SIGNUP BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white border rounded-lg py-3 mt-4 hover:bg-gray-100"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-5 h-5"
            alt="google"
          />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        <p className="mt-5 text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/user-login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
};

export default HomeOwnerRegistration;
