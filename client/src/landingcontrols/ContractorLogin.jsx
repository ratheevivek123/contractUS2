import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useContractor } from "../context/ContractorContext.jsx";

const ContractorLogin = () => {
  const navigate = useNavigate();
  const { setContractor } = useContractor();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Check for error in URL query params (from Google OAuth callback)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages = {
        google_auth_failed: "Google authentication failed. Please try again.",
        account_blocked: "Your account has been blocked by admin.",
        server_error: "Server error. Please try again later.",
      };
      setError(errorMessages[errorParam] || "An error occurred. Please try again.");
      // Clean up URL
      navigate("/contractor-login", { replace: true });
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/contractors/login",
        form,
        { withCredentials: true }
      );
      setContractor(res.data.contractor);
      navigate("/contractor");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // 🔥 GOOGLE LOGIN
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/contractors/google";
  };

  return (
    <div className="relative flex min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-[#012a38] to-[#004b61]"></div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="w-1/3 z-10 flex flex-col justify-center items-center px-10 text-white">
        <h1 className="text-5xl font-extrabold tracking-wide">ContractorPro</h1>
        <p className="mt-3 text-gray-300 text-lg">Manage work efficiently</p>
      </div>

      <div className="flex flex-1 justify-center items-center z-10">
        <form
          onSubmit={handleLogin}
          className="bg-white/20 backdrop-blur-xl border border-white/30 
          shadow-2xl rounded-2xl px-10 py-8 w-[380px]"
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Contractor Login
          </h2>

          {error && (
            <p className="text-red-300 bg-red-900/40 border border-red-700 rounded p-2 text-center mb-4">
              {error}
            </p>
          )}

          <label className="text-white text-sm">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg mb-4 bg-white/80"
          />

          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg mb-6 bg-white/80"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 
            text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>

          {/* 🔥 GOOGLE LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-4 bg-white text-gray-800 py-3 rounded-lg 
            font-semibold flex items-center justify-center gap-2"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="mt-5 text-sm text-center text-gray-300">
            New contractor?{" "}
            <Link to="/contractor-register" className="text-yellow-300">
              Register here
            </Link>
          </p>

          <p className="mt-4 text-sm text-center text-gray-300">
            Are you a user?{" "}
            <Link to="/user-login" className="text-yellow-300 hover:underline">
              Login as User
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ContractorLogin;
