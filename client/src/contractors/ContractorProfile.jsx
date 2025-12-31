
import React, { useState, useEffect } from "react";
import { useContractor } from "../context/ContractorContext.jsx";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ContractorProfile = () => {
  const { contractor, setContractor } = useContractor();

const [form, setForm] = useState({
  phone: "",
  address: "",
  profession: "",
  experienceLevel: "", // ⭐ ADDED
  bio: "",
  rate: "",
  skills: [{ name: "", rate: "" }],
});


  useEffect(() => {
    if (contractor) {
      const skillsFromBackend = Array.isArray(contractor.skills)
        ? contractor.skills.map((s) => ({
            name: s.name || "",
            rate: s.rate || "",
          }))
        : [{ name: "", rate: "" }];

      setForm({
        phone: contractor.phone || "",
        address: contractor.address || "",
        profession: contractor.profession || "",
        experienceLevel: contractor.experienceLevel || "",
        bio: contractor.bio || "",
        rate: contractor.rate || "",
        skills: skillsFromBackend.length ? skillsFromBackend : [{ name: "", rate: "" }],
      });
    }
  }, [contractor]);

  const handleChange = (e, index, field) => {
    if (field === "skill") {
      const updatedSkills = [...form.skills];
      updatedSkills[index].name = e.target.value;
      setForm({ ...form, skills: updatedSkills });
    } else if (field === "rate") {
      const updatedSkills = [...form.skills];
      const value = e.target.value;
      updatedSkills[index].rate = value === "" ? "" : parseInt(value);
      setForm({ ...form, skills: updatedSkills });
    } else if (field === "rateOverall") {
      const value = e.target.value;
      setForm({ ...form, rate: value === "" ? "" : parseInt(value) });
    } else {
      setForm({ ...form, [field]: e.target.value });
    }
  };

  const addSkill = () => {
    setForm({ ...form, skills: [...form.skills, { name: "", rate: "" }] });
  };

  const removeSkill = (index) => {
    const updatedSkills = form.skills.filter((_, i) => i !== index);
    setForm({ ...form, skills: updatedSkills.length ? updatedSkills : [{ name: "", rate: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.phone || !form.profession || !form.experienceLevel) {
      toast.error("Please fill Phone Number, Profession, and Experience Level");
      return;
    }

    try {
      const skillsArray = form.skills
        .filter((s) => s.name.trim() !== "")
        .map((s) => ({ name: s.name.trim(), rate: s.rate || 0 }));

      const res = await axios.patch(
        "http://localhost:3000/api/contractors/profile/update",
        {
          phone: form.phone,
          address: form.address,
          profession: form.profession,
          experienceLevel: form.experienceLevel,
          bio: form.bio,
          rate: form.rate || 0,
          skills: skillsArray,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update context with new contractor data
        if (res.data.contractor && setContractor) {
          setContractor(res.data.contractor);
        }
        toast.success("Profile updated successfully!");
        // Refresh the page to show updated data after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-8 bg-gradient from-gray-50 to-gray-200 rounded-2xl shadow-lg">
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
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">My Profile</h1>

      {contractor ? (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-8">
          <div className="grid sm:grid-cols-2 gap-4 text-gray-800">
            <p>
              <span className="font-semibold text-gray-600">Full Name:</span> {contractor.name}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Email:</span> {contractor.email}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Phone:</span> {contractor.phone}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Address:</span> {contractor.address}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Profession:</span>{" "}
              {contractor.profession || "Not added"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Experience:</span>{" "}
              {contractor.experienceLevel || "Not added"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Bio:</span> {contractor.bio || "Not added"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Overall Rate:</span> ₹{contractor.rate || 0}
            </p>
            <div className="col-span-full">
              <span className="font-semibold text-gray-600">Skills:</span>
              <div className="ml-2 mt-1">
                {(contractor.skills || []).map((skillObj, i) => {
                  const skillName = skillObj.name || "";
                  const skillRate = skillObj.rate || 0;
                  return (
                    <div key={i}>
                      {skillName} - ₹{skillRate}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">No profile data available.</p>
      )}

      <h2 className="text-2xl font-bold text-gray-700 mb-4">Update Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 gap-4"
      >
        <label className="font-semibold text-gray-700">Phone Number</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => handleChange(e, null, "phone")}
          className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />

        <label className="font-semibold text-gray-700">Address</label>
        <textarea
          value={form.address}
          onChange={(e) => handleChange(e, null, "address")}
          rows="3"
          placeholder="Enter your full address"
          className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />

        <label className="font-semibold text-gray-700">Profession</label>
        <select
          value={form.profession}
          onChange={(e) => handleChange(e, null, "profession")}
          className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        >
          <option value="">Select Profession</option>
          <option value="Contractor">Contractor</option>
          <option value="Material Supplier">Material Supplier</option>
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Painter">Painter</option>
          <option value="Mason">Mason</option>
          <option value="Labour">Labour</option>
          <option value="Interior Designer">Interior Designer</option>
          <option value="Architect">Architect</option>
        </select>

        <label className="font-semibold text-gray-700">Experience Level</label>
        <select
          value={form.experienceLevel}
          onChange={(e) => handleChange(e, null, "experienceLevel")}
          className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        >
          <option value="">Select Experience Level</option>
          <option value="Fresher">Fresher</option>
          <option value="Some Experience">Some Experience</option>
        </select>

        <label className="font-semibold text-gray-700">Overall Rate (₹)</label>
        <input
          type="number"
          value={form.rate}
          onChange={(e) => handleChange(e, null, "rateOverall")}
          className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />

        <label className="font-semibold text-gray-700">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => handleChange(e, null, "bio")}
          className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />

        <label className="font-semibold text-gray-700">Skills & Rates</label>
        {form.skills.map((skill, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Skill Name"
              value={skill.name}
              onChange={(e) => handleChange(e, index, "skill")}
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
            <input
              type="number"
              placeholder="Rate ₹"
              value={skill.rate}
              onChange={(e) => handleChange(e, index, "rate")}
              className="w-32 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSkill}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          + Add Skill
        </button>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold px-4 py-3 rounded-lg"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ContractorProfile;
