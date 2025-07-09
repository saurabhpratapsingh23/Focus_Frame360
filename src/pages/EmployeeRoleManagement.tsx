import React from 'react';

const EmployeeRoleManagement: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Title */}
        <div>
          <h3 className="text-lg font-bold text-white bg-blue-900 px-4 py-2 rounded-t-md">My Role</h3>
        </div>

        {/* Functional Division Selector */}
        <div>
          <h5 className="text-lg font-semibold text-gray-700 mb-2">Select Functional Division</h5>
          <select className="form-select w-64 border-gray-300 rounded-md shadow-sm text-sm p-2">
            <option selected>Marketing Division</option>
            <option>Development Function</option>
          </select>
        </div>

        {/* Editable Role Table */}
        <div>
          <h5 className="text-lg font-semibold text-gray-700 mb-2">Functional Role & Responsibility (I am in)</h5>
          <div className="bg-white shadow rounded-md overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
              <span className="font-semibold">Key Functional Role & Responsibility</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded">Add</button>
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
                      <button className="text-sm border border-gray-400 px-2 py-1 rounded hover:bg-gray-100">Edit</button>
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

        {/* Read-Only Roles */}
        <div className="bg-white rounded-md shadow p-4">
          <h5 className="text-lg font-semibold text-gray-700 mb-2">My Role</h5>
          <h6 className="py-2 px-2 mb-1">My Selected Roles</h6>
          <table className="w-full table-auto text-left text-sm border-t border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-[70%] font-medium">Functional Role</th>
                <th className="p-2 text-center font-medium">Assigned Responsibility</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">Manage social media presence across platforms</td>
                <td className="p-2 text-center">
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Perform</span>
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Rescue</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Conduct SEO reviews and updates for better search visibility</td>
                <td className="p-2 text-center">
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Perform</span>
                  <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75">Rescue</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default EmployeeRoleManagement;
