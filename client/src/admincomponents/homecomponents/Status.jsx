import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Status = () => {
  const [counts, setCounts] = useState({
    users: 0,
    contractors: 0,  // workers count (same collection)
    projects: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/counts", {
          withCredentials: true,
        });

        setCounts({
          users: res.data.counts.users,
          contractors: res.data.counts.contractors, // workers count
          projects: res.data.counts.projects,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Users",
      count: counts.users,
      to: "/Admin/users",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Workers",
      count: counts.contractors,
      to: "/Admin/contractors",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Projects",
      count: counts.projects,
      to: "/Admin/projects",
      color: "from-purple-500 to-fuchsia-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {cards.map((card, index) => (
        <Link to={card.to} key={index}>
          <div
            className={`
              bg-gradient-to-br ${card.color}
              text-white p-6 rounded-2xl shadow-xl
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-3xl
            `}
          >
            <h4 className="text-xl font-semibold mb-1 tracking-wide drop-shadow">
              {card.title}
            </h4>

            <p className="text-5xl font-extrabold drop-shadow-lg mt-2">
              {card.count}
            </p>

            <div className="mt-3 text-sm opacity-90 font-medium">
              View all {card.title.toLowerCase()} →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Status;
