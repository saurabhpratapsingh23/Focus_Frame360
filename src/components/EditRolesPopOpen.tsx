import React from 'react';

const EditRolesPopOpen = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Fetch user name from sessionStorage
  let userName = '';
  try {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      userName = user.e_fullname || user.name || 'John';
    }
  } catch {
    console.error('Error parsing user data from sessionStorage');
  }

  const headingText = userName ? `Functional Role & Responsibility (${userName} is in)` : 'Functional Role & Responsibility';

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm  flex items-center justify-center">
      <div className="bg-gray-100 min-h-[80vh] max-h-[90vh] w-full max-w-6xl p-6 rounded-lg shadow-lg relative overflow-y-auto">
        <button
          className="absolute top-8 right-9 text-red-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
        <div className="max-w-7xl mx-auto space-y-6">
         
        
            <h6 className='text-[25px] text-center font-bold text-white bg-gray-900 px-4 py-2 rounded-t-md rounded-b-md'>Roles Edit Sheet</h6>
            <h5 className="text-lg text-left font-bold text-gray-700 mb-1">{headingText}</h5>
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <p className="text-sm text-gray-700 m-0">Your Functional Division :</p>
              <h2 className="w-70 border-gray-300 font-bold rounded-md text-sm p-2">Development Function</h2>
              {/* <option>Development Function</option> */}
            </div>
          <div>
           
            <div className="bg-white shadow rounded-md overflow-hidden border border-gray-900">
              <div className="flex justify-center bg-blue-900 text-center text-white  px-4 py-3 ">
                <span className="font-bold ">Key Functional Role & Responsibility</span>
              </div>
              <div className="overflow-auto">
              <table className="table-auto w-full text-sm text-center ">
                <thead className="bg-gray-50 text-[15px] font-bold text-gray-700">
                  <tr>
                    <th className="text-left p-2">Functional Role</th>
                    <th className="p-2">Manage</th>
                    <th className="p-2">Define</th>
                    <th className="p-2">Perform</th>
                    <th className="p-2">Audit</th>
                    <th className="p-2">Rescue</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      role: 'Manage social media presence across platforms',
                      code: 'MKT-001',
                      manage: '',
                      define: '',
                      perform: 'Yes',
                      audit: '',
                      rescue: '',
                    },
                    {
                      role: 'Write and maintain backend code',
                      code: 'DEV-BE-COD',
                      manage: '',
                      define: 'Yes',
                      perform: 'Yes',
                      audit: '',
                      rescue: '',
                    },
                    {
                      role: 'Improve architecture scalability and performance',
                      code: 'DEV-ARC-SCL',
                      manage: '',
                      define: 'Yes',
                      perform: 'Yes',
                      audit: '',
                      rescue: '',
                    },
                    {
                      role: 'Lead marketing campaigns',
                      code: 'MKT-002',
                      manage: 'Yes',
                      define: '',
                      perform: '',
                      audit: '',
                      rescue: '',
                    },
                  ].map((row, idx) => (
                    <tr className="" key={idx}>
                      <td className="text-left px-3 py-2">
                        {row.role}<br />
                        <span className="text-xs text-gray-500">Code: {row.code}</span>
                      </td>
                      {[row.manage, row.define, row.perform, row.audit, row.rescue].map((value, i) => (
                        <td key={i} className="p-2 ">
                          <select className="text-sm border border-gray-300 rounded w-20 p-1" value={value} disabled>
                            <option>No</option>
                            <option selected={value === 'Yes'}>Yes</option>
                          </select>
                        </td>
                      ))}
                      <td className="p-2  space-x-2">
                        <button className="text-sm bg-blue-50 border border-gray-400 px-2 py-1 rounded hover:bg-blue-500 hover:text-white">Edit</button>
                        <button className="text-sm border border-red-400 text-red-600 px-2 py-1 rounded hover:bg-red-100">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end px-4 py-3 bg-gray-50">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded">SAVE</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
export default EditRolesPopOpen;