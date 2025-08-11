import React, { useEffect, useState } from 'react';
// import EditRolesPopOpen from './EditRolesPopOpen';

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

const RolesAndResponsibility: React.FC = () => {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [editRolesPopOpen, setEditRolesPopOpen] = useState(false);
  // const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    let empID = '';

    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        empID = parsedUser.e_emp_id || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data');
        setLoading(false);
        return;
      }
    } else {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/pms/api/e/roles/${empID}/E`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok (status: ${res.status})`);
        }
        return res.json();
      })
      .then((json) => {
        if (Array.isArray(json.roles)) {
          setData(json.roles);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // const handleEditClick = (role: Role) => {
  //   setSelectedRole(role);
  //   setEditRolesPopOpen(true);
  // };

  if (loading) return <div className="flex justify-center items-center min-h-[120px] text-gray-600 text-base sm:text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[120px] text-red-600 text-base sm:text-lg">Error: {error}</div>;

  return (
    <div className="bg-white rounded-md shadow p-2 sm:p-4 max-w-8xl mx-auto">
      <h3 className="text-lg sm:text-2xl px-2 py-2 text-white font-bold mb-4 bg-gray-900 text-center rounded-t-xl">
        My Roles and Responsibilities
      </h3>

      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-base sm:text-lg">No roles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full table-auto text-left text-xs sm:text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-[20%] bg-blue-100 text-[110%] sm:text-[130%] font-bold">Functional Role</th>
                <th className="p-2 w-[50%] bg-blue-100 text-[110%] sm:text-[130%] font-bold">Function Title</th>
                <th className="p-1 w-[20%] bg-blue-100 text-[110%] sm:text-[130%] text-center font-bold">
                  Assigned Responsibility
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-300' : 'bg-white'}>
                  <td className="p-2 break-words max-w-[120px] sm:max-w-none text-xs sm:text-sm">{item.erole_function_code}</td>
                  <td className="p-2 break-words max-w-[200px] sm:max-w-none text-xs sm:text-sm">{item.function_title}</td>
                  <td className="p-2 text-center flex flex-wrap justify-center gap-1 min-h-[40px]">
                    {item.erole_perform ? (
                      <span className="bg-gray-500 text-white text-xs rounded-full px-3 py-1 opacity-75">Perform</span>
                    ) : null}
                    {item.erole_rescue ? (
                      <span className="bg-gray-500 text-white text-xs rounded-full px-3 py-1 opacity-75">Rescue</span>
                    ) : null}
                    {item.erole_manage ? (
                      <span className="bg-gray-500 text-white text-xs rounded-full px-3 py-1 opacity-75">Manage</span>
                    ) : null}
                    {item.erole_audit ? (
                      <span className="bg-gray-500 text-white text-xs rounded-full px-3 py-1 opacity-75">Audit</span>
                    ) : null}
                    {item.erole_define ? (
                      <span className="bg-gray-500 text-white text-xs rounded-full px-3 py-1 opacity-75">Define</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RolesAndResponsibility;
