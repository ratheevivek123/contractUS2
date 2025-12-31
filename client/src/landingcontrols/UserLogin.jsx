import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

const UserLogin = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        form,
        { withCredentials: true }
      );
      setUser(res.data.user);
      navigate("/user");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  // 🔥 Google Login Handler (Frontend – Backend next step)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="relative flex min-h-screen">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-white" />

      <div className="w-1/3 relative z-10 flex flex-col justify-center items-center px-10">
        <h1 className="text-5xl font-extrabold tracking-wide text-purple-700 drop-shadow">
          ContractUs
        </h1>
        <p className="mt-3 text-gray-600 text-lg tracking-wide">
          Smart Home Service Platform
        </p>
      </div>

      <div className="flex flex-1 justify-center items-center z-10">
        <form
          onSubmit={handleLogin}
          className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl px-10 py-8 w-[380px]"
        >
          <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
            User Login
          </h2>

          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center mb-4">
              {error}
            </p>
          )}

          <label className="text-gray-700 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg mb-4 bg-white/70 focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Enter Email"
            required
          />

          <label className="text-gray-700 text-sm">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg mb-6 bg-white/70 focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Enter Password"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold mb-4 hover:opacity-90"
          >
            Login
          </button>

          {/* GOOGLE LOGIN BUTTON */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              className="w-5 h-5"
              alt="google"
            />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>

          <p className="mt-5 text-sm text-center text-gray-700">
            Don’t have an account?{" "}
            <Link to="/user-register" className="text-purple-700 font-medium hover:underline">
              Register here
            </Link>
          </p>

          <p className="mt-3 text-sm text-center text-gray-700">
            Are you a contractor?{" "}
            <Link to="/contractor-login" className="text-indigo-700 hover:underline">
              Login as Contractor
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
