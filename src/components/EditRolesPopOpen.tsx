import React from 'react';

const EditRolesPopOpen = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-gray-100 min-h-[80vh] max-h-[90vh] w-full max-w-6xl p-6 rounded-lg shadow-lg relative overflow-y-auto">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Functional Division Selector */}
{/* <div className='text-lg font-semibold text-gray-700 mb-2' >Roles Edit Sheet</div> */}

          <div>
            <h1 className='text-2xl font-bold text-gray-700 mb-2'>Roles Edit Sheet</h1>
            <h6 className="text-sm font-semibold text-gray-700 mb-1 mt-3 px-2 py-2">Your Functional Division</h6>
            
              <p className='w-64 border-gray-300 rounded-md shadow-sm text-sm p-2'>Development Function</p>
              {/* <option>Development Function</option> */}
            
          </div>
          <div>
            <h5 className="text-lg font-semibold text-gray-700 mb-2">Functional Role & Responsibility (I am in)</h5>
            <div className="bg-white shadow rounded-md overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
                <span className="font-semibold">Key Functional Role & Responsibility</span>
                {/* <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded">Add</button> */}
              </div>
              <div className="overflow-auto">
              <table className="table-auto w-full text-sm text-center border border-gray-300">
                <thead className="bg-gray-50 font-semibold text-gray-700">
                  <tr>
                    <th className="text-left p-2 border">Functional Role</th>
                    <th className="p-2 border">Manage</th>
                    <th className="p-2 border">Define</th>
                    <th className="p-2 border">Perform</th>
                    <th className="p-2 border">Audit</th>
                    <th className="p-2 border">Rescue</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="text-left px-3 py-2">
                      Manage social media presence across platforms<br />
                      <span className="text-xs text-gray-500">Code: MKT-001</span>
                    </td>
                    {['', '', 'Yes', '', ''].map((value, idx) => (
                      <td key={idx} className="p-2 border">
                        <select className="text-sm border border-gray-300 rounded w-20 p-1">
                          <option>No</option>
                          <option selected={value === 'Yes'}>Yes</option>
                        </select>
                      </td>
                    ))}
                    <td className="p-2 border space-x-2">
                      <button className="text-sm border border-gray-400 px-2 py-1 rounded hover:bg-blue-500">Edit</button>
                      <button className="text-sm border border-red-400 text-red-600 px-2 py-1 rounded hover:bg-red-100">Delete</button>
                    </td>
                  </tr>
                  {/* Add more editable rows as needed */}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1 rounded">SAVE</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
export default EditRolesPopOpen;