
import React, { useEffect, useState } from 'react';
import EditRolesPopOpen from './EditRolesPopOpen';

interface Role {
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
}

interface RoleData {
  Role: Role;
  Division: string;
  FunctionTitle: string;
}

const RolesAndResponsibility: React.FC = () => {
  const [data, setData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editRolesPopOpen, setEditRolesPopOpen] = useState(false);

  useEffect(() => {
    // Get empID from localStorage (currentUser)
      const userStr = localStorage.getItem('currentUser');
    //   console.log('User data from localStorage:', userStr);

      let empID = '';
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        // empID = 'kyc10019';
        empID = parsedUser.e_emp_code;
        // console.log('Parsed empID:', empID);
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
    setLoading(true);
    setError(null);
    // fallback to default empID if not found
    if (!empID) empID = '';

    // Use VITE_API_BASE_URL from .env
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/pms/api/e/roles/${empID}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok (status: ${res.status}) for URL: ${url}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(Array.isArray(json) ? json : [json]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // <div style={{ padding: '1rem' }}>
    //   <h2>Roles and Responsibilities</h2>
    //   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    //     <thead>
    //       <tr>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Division</th>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Function Title</th>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Function Code</th>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Perform</th>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Manage</th>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Audit</th>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Rescue</th>
    //         <th style={{ border: '1px solid #ccc', padding: '8px' }}>Define</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {data.map((item, idx) => (
    //         <tr key={idx}>
    //           <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.Division}</td>
    //           <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.FunctionTitle}</td>
    //           <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.Role.erole_function_code}</td>
    //           <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{item.Role.erole_perform ? '✔️' : ''}</td>
    //           <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{item.Role.erole_manage ? '✔️' : ''}</td>
    //           <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{item.Role.erole_audit ? '✔️' : ''}</td>
    //           <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{item.Role.erole_rescue ? '✔️' : ''}</td>
    //           <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{item.Role.erole_define ? '✔️' : ''}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
     <div className="bg-white rounded-md shadow p-4">
          <h3 className="text-2xl px-2  py-4 text-white font-bold mb-4 bg-gray-700 text-center rounded-t-xl">My Roles and Responsibilities</h3>
          {/* <h6 className="py-2 px-2 mb-1">My Selected Roles</h6> */}
          <table className="w-full table-auto text-left text-sm border-t border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-[50%] bg-blue-100 font-lg text-[130%] font-bold">Function Title</th>
                <th className="p-2 w-[20%] bg-blue-100 font-lg text-[130%] font-bold">Functional Role</th>
                <th className="p-1 w-[20%] bg-blue-100 font-lg text-[130%] text-center font-bold">Assigned Responsibility</th>
                <th className="p-2 bg-blue-100 font-lg text-[130%] text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} className="border-t">

                    <td className="p-2">{item.FunctionTitle}</td>
                    <td className="p-2">{item.Role.erole_function_code}</td>
                    <td className="p-2  text-center">
                      {item.Role.erole_perform ? <span className="bg-gray-500 text-white text-xs rounded-full px-4 py-1 opacity-75 mr-2">Perform</span> : null}
                      {item.Role.erole_rescue ? <span className="bg-gray-500 text-white text-xs rounded-full px-4 py-1 opacity-75 mr-2">Rescue</span> : null}
                      {item.Role.erole_manage ? <span className="bg-gray-500 text-white text-xs rounded-full px-4 py-1 opacity-75 mr-2">Manage</span> : null}
                      {item.Role.erole_audit ? <span className="bg-gray-500 text-white text-xs rounded-full px-4 py-1 opacity-75 mr-2">Audit</span> : null}
                      {item.Role.erole_define ? <span className="bg-gray-500 text-white text-xs rounded-full px-4 py-1 opacity-75 mr-2">Define</span> : null}
                    </td>
                    <td className="p-2 text-center">
                      <button className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md" title="Edit" onClick={() => setEditRolesPopOpen(true)}>Edit</button>
                      </td>
                  </tr>
                ))}

              {/* <tr className="border-t" >                ✏️
                <td className="p-2">{item}</td>
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
              </tr> */}
            </tbody>
          </table>
          <EditRolesPopOpen isOpen={editRolesPopOpen} onClose={() => setEditRolesPopOpen(false)}/>
        </div>
  );
};

export default RolesAndResponsibility;
