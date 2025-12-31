import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ContractorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    pincode: '',
    profession: '',
    experienceLevel: ''
  });

  const professions = [
    'Contractor',
    'Material Supplier',
    'Plumber',
    'Electrician',
    'Painter',
    'Mason',
    'Labour',
    'Interior Designer',
    'Architect'
    
  ];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/api/contractors/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      console.log('Success:', res.data);
      alert('Contractor registered successfully!');
      navigate('/contractor-login'); // Redirect to login page after successful registration
    } catch (err) {
      console.error('Registration Error:', err.response?.data || err.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Contractor Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="tel"
          name="phone"
          pattern="[6-9]{1}[0-9]{9}"
          maxLength="10"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <select
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select Profession</option>
          {professions.map((profession) => (
            <option key={profession} value={profession}>
              {profession}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="experienceLevel"
              value="Fresher"
              checked={formData.experienceLevel === 'Fresher'}
              onChange={handleChange}
              className="mr-2"
            />
            Fresher
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="experienceLevel"
              value="Some Experience"
              checked={formData.experienceLevel === 'Some Experience'}
              onChange={handleChange}
              className="mr-2"
            />
            Some Experience
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/contractor-login')}
          className="text-blue-600 hover:underline font-medium"
        >
          Login here
        </button>
      </p>

      {/* Home Owner Registration Link */}
      <p className="text-center mt-2 text-sm">
        Want to register as a{' '}
        <Link
          to="/user-register"
          className="text-purple-600 hover:underline font-medium"
        >
          Home Owner?
        </Link>
      </p>
    </div>
  );
};

export default ContractorRegister;
