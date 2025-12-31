import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 

const Register = () => {
     const navigate = useNavigate();
    const [form, setForm] = useState({
        Name: "",
        Email: "",
        Password: "",
        Age: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!form.Name || !form.Email || !form.Password || !form.Age) {
            alert("All fields are required");
            return;
        }

        if (Number(form.Age) < 20) {
            alert("Age must be at least 20");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", form);
            alert("Registered successfully!");
            console.log(response.data);
            setForm({ Name: "", Email: "", Password: "", Age: "" });
            navigate("/login");

        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-700">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col min-w-[320px] max-w-[90vw]"
            >
                <h2 className="text-center mb-6 text-purple-700 font-bold text-2xl">Register</h2>

                <label className="mb-2 text-gray-800">Name</label>
                <input
                    type="text"
                    name="Name"
                    value={form.Name}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="p-3 mb-4 border border-gray-200 rounded-lg outline-none text-base focus:ring-2 focus:ring-purple-400"
                />

                <label className="mb-2 text-gray-800">Email</label>
                <input
                    type="email"
                    name="Email"
                    value={form.Email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="p-3 mb-4 border border-gray-200 rounded-lg outline-none text-base focus:ring-2 focus:ring-purple-400"
                />

                <label className="mb-2 text-gray-800">Password</label>
                <input
                    type="password"
                    name="Password"
                    value={form.Password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="p-3 mb-6 border border-gray-200 rounded-lg outline-none text-base focus:ring-2 focus:ring-purple-400"
                />

                <label className="mb-2 text-gray-800">Age</label>
                <input
                    type="number"
                    name="Age"
                    value={form.Age}
                    onChange={handleChange}
                    min={20}
                    placeholder="Enter Age"
                    className="p-3 mb-6 border border-gray-200 rounded-lg outline-none text-base focus:ring-2 focus:ring-purple-400"
                />

                <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-400 to-purple-700 text-white p-3 rounded-lg font-bold text-base hover:from-indigo-500 hover:to-purple-800 transition"
                >
                    Register
                </button>

                <p className="mt-4 text-center text-gray-500 text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-700 font-bold hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Register;
