import React, { useState } from 'react';
import axios from 'axios';

const ContractorLogin = () => {
    const [form, setForm] = useState({ Email: "", Password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.Email || !form.Password) {
            alert("Email and Password are required");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", form); // Replace with actual endpoint
            alert("Login successful");
            console.log(res.data);
        } catch (error) {
            console.error(error);
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-700">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col min-w-[320px] max-w-[90vw]"
            >
                <h2 className="text-center mb-6 text-purple-700 font-bold text-2xl">Contractor Login</h2>

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

                <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-400 to-purple-700 text-white p-3 rounded-lg font-bold text-base hover:from-indigo-500 hover:to-purple-800 transition"
                >
                    Login
                </button>

                <p className="mt-4 text-center text-gray-500 text-sm">
                    Don’t have an account?{" "}
                    <a href="/contractor/register" className="text-purple-700 font-bold hover:underline">
                        Register here
                    </a>
                </p>
            </form>
        </div>
    );
};

export default ContractorLogin;
