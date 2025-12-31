import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContractor } from "../context/ContractorContext.jsx";

const ContractorsService = () => {
  const { contractor, loading: contractorLoading } = useContractor();

  const [services, setServices] = useState([]);
 

console.log("CONTRACTOR CONTEXT DATA:", contractor);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [loading, setLoading] = useState(false);


const fetchServices = async () => {
  try {
    if (!contractor?._id) return;

    const res = await axios.get(
      `http://localhost:3000/api/services/contractor/${contractor._id}`,
      { withCredentials: true }
    );

    console.log("✅ Services Fetched:", res.data.services);
    setServices(res.data.services);
  } catch (error) {
    console.log("❌ Error fetching services", error);
  }
};


  useEffect(() => {
    if (!contractorLoading) {
      fetchServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractorLoading, contractor?._id]);

  // 🔹 Form change
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // 🔹 Add OR Update service
 const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("🟢 Adding service:", form);

  try {
    let res;

    if (editingServiceId) {
      res = await axios.put(
        `http://localhost:3000/api/services/${editingServiceId}`,
        form,
        { withCredentials: true }
      );
    } else {
      res = await axios.post(`http://localhost:3000/api/services`, form, {
        withCredentials: true,
      });
    }

    console.log("🟢 Service saved:", res.data);

    if (res.data.success) {
      alert(editingServiceId ? "Service Updated ✅" : "Service Added ✅");
      setForm({ title: "", description: "", category: "", price: "" });
      setEditingServiceId(null);
      fetchServices();
    }
  } catch (err) {
    console.error("❌ ERROR SUBMITTING SERVICE", err.response?.data || err.message);
  }
};

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/services/${id}`,
        { withCredentials: true }
      );
      if (res.data?.success) {
        alert("Deleted Successfully ✅");
        fetchServices();
      } else {
        alert(res.data?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // 🔹 Edit prefill
  const handleEditClick = (service) => {
    setEditingServiceId(service._id);
    setForm({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "",
      price: service.price ?? "",
    });
  };
  

  if (contractorLoading) {
    return <div className="p-6">Loading contractor...</div>;
  }

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Manage Services</h2>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Service Title"
          value={form.title}
          onChange={handleChange}
          className="p-3 rounded-lg border"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="p-3 rounded-lg border"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Service Price (₹)"
          value={form.price}
          onChange={handleChange}
          className="p-3 rounded-lg border"
          required
          min="0"
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={form.description}
          onChange={handleChange}
          className="p-3 rounded-lg border col-span-full"
          required
        />

        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          {editingServiceId ? "Update Service" : "Add Service"}
        </button>
      </form>

      {/* LIST */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">Your Services</h3>
        {loading && <span className="text-sm text-gray-500">Refreshing…</span>}
      </div>

      {services.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-600">
          No services yet. Add your first service above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h4 className="text-lg font-bold text-blue-600">{service.title}</h4>
              <p className="text-gray-600 mt-1">{service.description}</p>
              <div className="mt-3 text-sm text-gray-500">
                <span className="inline-block bg-gray-100 px-2 py-1 rounded">
                  {service.category}
                </span>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold">₹{service.price}</span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-md"
                    onClick={() => handleEditClick(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                    onClick={() => handleDelete(service._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractorsService;
