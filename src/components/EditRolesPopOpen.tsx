import React from 'react';

const EditRolesPopOpen = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-gray-100 min-h-[80vh] max-h-[90vh] w-full max-w-6xl p-6 rounded-lg shadow-lg relative overflow-y-auto">
        <button
          className="absolute top-7 right-9 text-red-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
        <div className="max-w-7xl mx-auto space-y-6">
         

         
            <h6 className='text-2xl text-center font-bold text-white bg-gray-900 px-4 py-2 rounded-t-md'>Roles Edit Sheet</h6>
             <h5 className="text-lg text-center font-bold text-gray-700 mb-1">Functional Role & Responsibility (I am in)</h5>
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <p className="text-sm text-gray-700 m-0">Your Functional Division :</p>
              <h2 className="w-70 border-gray-300 font-bold rounded-md text-lg p-2">Development Function</h2>
              {/* <option>Development Function</option> */}
            </div>
          <div>
           
            <div className="bg-white shadow rounded-md overflow-hidden">
              <div className="flex justify-center bg-blue-900 text-center text-white  px-4 py-3 border-b">
                <span className="font-bold ">Key Functional Role & Responsibility</span>
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