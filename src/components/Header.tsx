import React, { useState, useEffect } from 'react';
// import { mockUsers } from '../lib/mockAPIData';

interface User {
  e_emp_code: string;
  e_fullname: string;
  e_work_location: string;
  e_address: string;
  e_email: string;
  e_phone: string;
  e_department: string;
  e_designation: string;
  e_DOJ: string;
  e_DOB: string;
  e_emp_id: number;
  e_password: string;
  e_last_login_date: string;
  e_active: boolean;
  e_create_date: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lastLoginTime, setLastLoginTime] = useState<string>('');
  const [loginDate, setLoginDate] = useState<string>('');

  useEffect(() => {
    // Get user information from localStorage
    const userData = localStorage.getItem('currentUser');
    const loginTime = localStorage.getItem('lastLoginTime');
    // Removed mockUsers and savedUsername fallback logic
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    }
    if (loginTime) {
      try {
        const date = new Date(loginTime);
        setLastLoginTime(date.toLocaleString());
        setLoginDate(date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }));
      } catch (error) {
        console.error('Error parsing login time from localStorage:', error);
        localStorage.removeItem('lastLoginTime');
        setLastLoginTime('');
        setLoginDate('');
      }
    } else {
      // Set login date as today if no login time is stored
      const today = new Date();
      setLoginDate(today.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }));
    }
  }, []);

  return (
    <div className="h-18 bg-gray-100 px-5 flex items-center justify-between border-b-2 border-[#1d2a56]">
      <div className="text-sm-2 text-gray-800">
        Welcome, <span className="font-bold text-black">{user?.e_fullname || 'No Name'}</span> |
        
         <span className='font-bold text-black px-2'>Login Date:</span>  {loginDate || '-'}
        {/* | Last Login: <span className="font-bold">{lastLoginTime || 'N/A'}</span> */}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <p>Last Updated: <span className='font-bold text-black'>{user?.e_last_login_date}</span></p>
        <button
          className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition"
          onClick={() => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('lastLoginTime');
            localStorage.removeItem('savedUsername');
            localStorage.removeItem('savedPassword');
            window.location.href = '/';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
