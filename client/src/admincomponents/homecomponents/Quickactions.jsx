import React from 'react'

const Quickactions = () => {
  return (
    <div><div className="flex gap-4 my-6">
  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">+ Add Contractor</button>
  <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">+ Add Supplier</button>
  <button className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700">+ Add Project</button>
</div>
</div>
  )
}

export default Quickactions