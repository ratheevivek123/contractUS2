import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ContractorDetails = () => {
  const { id } = useParams(); // contractor id
  const [contractor, setContractor] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContractor = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/contractors/${id}`
      );
      setContractor(res.data.contractor);
      console.log("Fetched Contractor are:", res.data.contractor);
    } catch (error) {
      console.log("Error fetching contractor:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/services/contractor/${id}`
      );
      setServices(res.data.services);
    } catch (error) {
      console.log("Error fetching contractor services", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchContractor(), fetchServices()]).then(() =>
      setLoading(false)
    );
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!contractor)
    return <p className="text-center p-6 text-red-500">Contractor not found</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">

        <div className="flex items-center gap-6">
          <img
            src={contractor.avatar || `https://i.pravatar.cc/150?u=${contractor._id}`}
            alt="Contractor"
            className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
          />

          <div>
            <h1 className="text-3xl font-bold">{contractor.name}</h1>
            <p className="text-gray-600">{contractor.profession}</p>
            <p className="text-gray-500 text-sm">{contractor.bio}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Skills</h2>
          <div className="flex gap-2 flex-wrap">
            {(contractor.skills || []).map((s) => (
              <span key={s._id} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {s.name} – ₹{s.rate}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">Services Offered</h2>

          {services.length === 0 ? (
            <p className="text-gray-500">No services added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv._id} className="bg-gray-100 p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-indigo-700">{srv.title}</h3>
                  <p className="text-gray-600">{srv.description}</p>
                  <p className="mt-2 font-semibold">₹{srv.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorDetails;
