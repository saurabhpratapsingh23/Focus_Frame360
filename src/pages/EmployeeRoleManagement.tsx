import React, { useEffect, useState } from 'react';
// import { User } from '../components/Header';
// import RolesAndResponsibility from '../components/RolesAndResponsibility';

interface Division {
  division_id: number;
  division_code: string;
  division: string;
  division_description: string;
  co_id: number;
  division_hod: string;
}

interface Role {
  erole_emp_id: number;
  erole_emp_code: string;
  erole_function_id: number;
  erole_function_code: string;
  erole_perform: number;
  erole_manage: number;
  erole_audit: number;
  erole_rescue: number;
  erole_define: number;
  erole_co_id: number;
  erole_division_code: string;
  erole_division_id: number;
  erole_id: number;
  flag: string;
  division_name: string;
  function_title: string;
  deleted: string;
}

const EmployeeRoleManagement: React.FC = () => {

  const [roles, setRoles] = useState<Role[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Read-only roles state
  const [readonlyRoles, setReadonlyRoles] = useState<Role[]>([]);
  const [readonlyLoading, setReadonlyLoading] = useState(true);
  const [readonlyError, setReadonlyError] = useState<string | null>(null);

  useEffect(() => {

    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      setReadonlyLoading(true);
      setReadonlyError(null);
      try {
        // Get empId from sessionStorage (e_emp_id)
        let empId = '';
        const userStr = sessionStorage.getItem('currentUser');
        if (userStr) {
          try {
            const parsedUser = JSON.parse(userStr);
            empId = parsedUser.e_emp_id || '';
          } catch {
            throw new Error('Invalid user data in sessionStorage');
          }
        }
        if (!empId) throw new Error('User not logged in');
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        // Editable roles (A)
        const urlA = `${baseUrl}/pms/api/e/roles/${empId}/A`;
        const responseA = await fetch(urlA);
        if (!responseA.ok) throw new Error(`API error: ${responseA.status}`);
        const dataA = await responseA.json();
        setRoles(Array.isArray(dataA.roles) ? dataA.roles : []);
        setDivisions(Array.isArray(dataA.division_list) ? dataA.division_list : []);
        if (Array.isArray(dataA.division_list) && dataA.division_list.length > 0) {
          setSelectedDivision(dataA.division_list[0].division_id);
        }
        // Read-only roles (E)
        const urlE = `${baseUrl}/pms/api/e/roles/${empId}/E`;
        const responseE = await fetch(urlE);
        if (!responseE.ok) throw new Error(`Read-only API error: ${responseE.status}`);
        const dataE = await responseE.json();
        setReadonlyRoles(Array.isArray(dataE.roles) ? dataE.roles : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch roles');
          setReadonlyError(err.message || 'Failed to fetch read-only roles');
        } else {
          setError('Failed to fetch roles');
          setReadonlyError('Failed to fetch read-only roles');
        }
      } finally {
        setLoading(false);
        setReadonlyLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Page Title */}
        <div>
          <h3 className="text-2xl font-bold text-center text-white bg-gray-900 px-2 py-2 sm:px-4 rounded-t-md ">My Role</h3>
        </div>

        {/* Functional Division Selector */}
        <div>
          <h5 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Select Functional Division</h5>
          <select
            className="form-select w-full max-w-xs border-gray-300 rounded-md shadow-sm text-sm p-2 focus:ring-2 focus:ring-blue-400"
            value={selectedDivision ?? ''}
            onChange={e => setSelectedDivision(Number(e.target.value))}
            disabled={divisions.length === 0}
          >
            {divisions.map((div) => (
              <option key={div.division_id} value={div.division_id}>
                {div.division}
              </option>
            ))}
          </select>
        </div>

        {/* Editable Role Table (API Data) */}
        <div>
          <h5 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Functional Role & Responsibility (I am in)</h5>
          <div className="bg-white shadow rounded-md overflow-hidden">
            <div className="flex justify-center bg-blue-900 text-center text-white  px-4 py-3">
              <span className="font-semibold  text-sm sm:text-base">Key Functional Role & Responsibility</span>
              {/* <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">Add</button> */}
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : error ? (
                <div className="p-4 text-red-600 text-center">{error}</div>
              ) : (
                <table className="min-w-[600px] w-full text-xs sm:text-sm text-center border border-gray-300">
                  <thead className="bg-gray-50 font-semibold text-gray-700">
                    <tr>
                      <th className="text-left p-2 ">Functional Role</th>
                      <th className="p-2 ">Manage</th>
                      <th className="p-2 ">Define</th>
                      <th className="p-2 ">Perform</th>
                      <th className="p-2 ">Audit</th>
                      <th className="p-2 ">Rescue</th>
                      <th className="p-2 ">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.filter(role => selectedDivision == null || role.erole_division_id === selectedDivision).length === 0 ? (
                      <tr><td colSpan={7} className="p-4 text-gray-500">No roles found for this division.</td></tr>
                    ) : (
                      roles
                        .filter(role => selectedDivision == null || role.erole_division_id === selectedDivision)
                        .map((role) => (
                          <tr key={role.erole_id || role.erole_function_id} className="">
                            <td className="text-left px-2 sm:px-3 py-2">
                              {role.function_title}<br />
                              <span className="text-xs text-gray-500">Code: {role.erole_function_code}</span>
                            </td>
                            <td className="p-">
                              <select
                                className={`text-xs sm:text-sm border border-gray-300 rounded w-16 sm:w-20 p-1 ${role.erole_manage ? 'bg-green-200' : 'bg-orange-200'}`}
                                value={role.erole_manage ? 'Yes' : 'No'}
                                disabled
                              >
                                <option>No</option>
                                <option>Yes</option>
                              </select>
                            </td>
                            <td className="p-2 ">
                              <select
                                className={`text-xs sm:text-sm border border-gray-300 rounded w-16 sm:w-20 p-1 ${role.erole_define ? 'bg-green-200' : 'bg-orange-200'}`}
                                value={role.erole_define ? 'Yes' : 'No'}
                                disabled
                              >
                                <option>No</option>
                                <option>Yes</option>
                              </select>
                            </td>
                            <td className="p-2 ">
                              <select
                                className={`text-xs sm:text-sm border border-gray-300 rounded w-16 sm:w-20 p-1 ${role.erole_perform ? 'bg-green-200' : 'bg-orange-200'}`}
                                value={role.erole_perform ? 'Yes' : 'No'}
                                disabled
                              >
                                <option>No</option>
                                <option>Yes</option>
                              </select>
                            </td>
                            <td className="p-2 ">
                              <select
                                className={`text-xs sm:text-sm border border-gray-300 rounded w-16 sm:w-20 p-1 ${role.erole_audit ? 'bg-green-200' : 'bg-orange-200'}`}
                                value={role.erole_audit ? 'Yes' : 'No'}
                                disabled
                              >
                                <option>No</option>
                                <option>Yes</option>
                              </select>
                            </td>
                            <td className="p-2 ">
                              <select
                                className={`text-xs sm:text-sm border border-gray-300 rounded w-16 sm:w-20 p-1 ${role.erole_rescue ? 'bg-green-200' : 'bg-orange-200'}`}
                                value={role.erole_rescue ? 'Yes' : 'No'}
                                disabled
                              >
                                <option>No</option>
                                <option>Yes</option>
                              </select>
                            </td>
                            <td className="p-2  space-x-1 sm:space-x-2">
                              <button className="text-xs sm:text-sm border border-gray-400 px-1 sm:px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">Edit</button>
                              <button className="text-xs sm:text-sm border border-red-400 text-red-600 px-1 sm:px-2 py-1 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400">Delete</button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 px-2 sm:px-4 py-3 border-t bg-gray-50">
              <button className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400">SAVE</button>
            </div>
          </div>
        </div>

        {/* Read-Only Roles */}
        <div className="bg-white rounded-md shadow p-2 sm:p-2">
          <h5 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">My Role (Read-Only)</h5>
          <div className="overflow-x-auto">
            <table className="min-w-[300px] w-full table-auto text-left text-xs sm:text-sm border-t border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 w-[70%] font-medium">Functional Role</th>
                  <th className="p-2 text-center font-medium">Assigned Responsibility</th>
                </tr>
              </thead>
              <tbody>
                {readonlyLoading ? (
                  <tr><td colSpan={2} className="p-4 text-center">Loading...</td></tr>
                ) : readonlyError ? (
                  <tr><td colSpan={2} className="p-4 text-red-600 text-center">{readonlyError}</td></tr>
                ) : readonlyRoles.filter(role => selectedDivision == null || role.erole_division_id === selectedDivision).length === 0 ? (
                  <tr><td colSpan={2} className="p-4 text-gray-500 text-center">No roles found for this division.</td></tr>
                ) : (
                  readonlyRoles
                    .filter(role => selectedDivision == null || role.erole_division_id === selectedDivision)
                    .map((role) => {
                      const responsibilities = [];
                      if (role.erole_manage) responsibilities.push('Manage');
                      if (role.erole_define) responsibilities.push('Define');
                      if (role.erole_perform) responsibilities.push('Perform');
                      if (role.erole_audit) responsibilities.push('Audit');
                      if (role.erole_rescue) responsibilities.push('Rescue');
                      return (
                        <tr key={role.erole_id || role.erole_function_id} className="border-t">
                          <td className="p-2">{role.function_title}</td>
                          <td className="p-2 text-center">
                            {responsibilities.length === 0 ? (
                              <span className="text-xs text-gray-400">None</span>
                            ) : (
                              responsibilities.map((resp) => (
                                <span key={resp} className="bg-gray-500 text-white text-xs rounded-full px-2 py-1 opacity-75 mr-1">{resp}</span>
                              ))
                            )}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
};

export default EmployeeRoleManagement;
