import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center">Welcome to Contact Us</h1>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => navigate("/user-login")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            I am a Home Owner
          </button>
          <p className="text-sm">
            New here?{" "}
            <span
              onClick={() => navigate("/user-register")}
              className="text-blue-500 underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => navigate("/contractor-login")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            I am a Contractor
          </button>
          <p className="text-sm">
            New here?{" "}
            <span
              onClick={() => navigate("/contractor-register")}
              className="text-green-500 underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
