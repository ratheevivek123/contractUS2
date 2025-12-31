import React, { useEffect, useState } from "react";
import axios from "axios";

const Activities = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/logs", {
          withCredentials: true,
        });
        setLogs(res.data.logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white/10 text-white p-6 rounded-xl shadow-lg my-6 backdrop-blur-lg">
      <h4 className="text-lg font-semibold mb-4">Recent Activities</h4>

      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th className="border-b p-2">Date</th>
            <th className="border-b p-2">Activity</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-b border-white/10">
              <td className="p-2">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="p-2">{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
