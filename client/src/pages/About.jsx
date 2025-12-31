import React from "react";

const About = () => {
  return (
    <div className="text-white">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">About This Platform</h1>

      {/* Main Card */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-xl shadow-lg space-y-6">

        {/* Overview Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">📌 Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            ContractUs is a modern home-services platform that connects 
            <b> users (homeowners)</b> with <b>contractors & suppliers</b> including 
            plumbers, electricians, labor, painters, interior designers, and more.
            <br /><br />
            The admin panel provides complete control over the platform:
            monitoring users, contractors, bookings, and messages.
          </p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">🚀 Key Features</h2>
          <ul className="list-disc ml-6 text-gray-300 space-y-1">
            <li>User & Contractor Management</li>
            <li>Bookings overview (Status, Date, Contractor, User)</li>
            <li>Block / Unblock control</li>
            <li>Real-time project status updates</li>
            <li>Service & category management</li>
            <li>Analytics (Coming Soon)</li>
          </ul>
        </section>

        {/* Mission */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">🎯 Our Mission</h2>
          <p className="text-gray-300">
            Our mission is to simplify the hiring of contractors and service
            providers for homeowners by offering transparency, reliability, and 
            easy booking through a single platform.
          </p>
        </section>

        {/* Technology */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">💻 Technology Stack</h2>
          <ul className="list-disc ml-6 text-gray-300 space-y-1">
            <li>Frontend: React + Tailwind CSS</li>
            <li>Backend: Node.js + Express.js</li>
            <li>Database: MongoDB (Mongoose)</li>
            <li>Authentication: JWT + Cookies</li>
            <li>Deployment: Render / Vercel (Coming)</li>
          </ul>
        </section>

        {/* Developer */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">👨‍💻 Developer</h2>
          <p className="text-gray-300">
            Developed with ❤️ by <b>Vivek Rathee</b>  
            <br />
            Passionate about building real-world problem-solving platforms.
          </p>
        </section>

        {/* Version Info */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">📄 Version</h2>
          <p className="text-gray-300">ContractUs Admin Panel — <b>v1.0.0</b></p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">📬 Contact</h2>
          <p className="text-gray-300">
            Phone: <b>7015814413</b> <br />
            Email: <b>ratheevivek521@gmail.com</b>
          </p>
        </section>

      </div>
    </div>
  );
};

export default About;
