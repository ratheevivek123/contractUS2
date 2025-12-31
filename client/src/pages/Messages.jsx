import React from 'react'

const Messages = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <p className="text-gray-700">View and respond to user messages here.</p>

      {/* Placeholder for message list */}
      <div className="mt-6 border rounded p-4 bg-white shadow">
        <p className="text-gray-500 italic">Messages will appear here...</p>
      </div>
    </div>
  );
}

export default Messages