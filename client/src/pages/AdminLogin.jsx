import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/login",
        form,
        { withCredentials: true }
      );

      if (res.data.admin) navigate("/Admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen">

      {/* ✅ Background with dark overlay & gradient */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521542464131-cb30f7398bc6')] 
        bg-cover bg-center"
      ></div>

      <div className="absolute inset-0 bg-[#0d1126]/90 backdrop-blur-sm"></div>

      {/* ✅ Left Transparent Branding Section */}
      <div className="w-1/3 relative z-10 flex flex-col justify-center items-center px-10 text-white">
        <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-lg">
          ADMIN PANEL
        </h1>
        <p className="mt-3 text-gray-300 text-lg tracking-wide">
          Control Center
        </p>
      </div>

      {/* ✅ Right side Login Form */}
      <div className="flex flex-1 justify-center items-center z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl 
          rounded-2xl px-10 py-8 w-[380px] transform transition-all duration-300 hover:shadow-xl"
        >
          <h2 className="text-3xl font-extrabold text-center text-white drop-shadow mb-6">
            Welcome Back
          </h2>

          {error && (
            <p className="text-red-500 bg-red-50 border border-red-200 rounded p-2 text-center mb-4">
              {error}
            </p>
          )}

          <label className="text-white text-sm">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg mb-4 bg-white/70 
            focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg mb-6 bg-white/70
            focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg 
            font-semibold transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
