import React, { useState, useEffect } from 'react';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Listen for changes to empCode in sessionStorage
    const fetchEmployeeInfo = () => {
      const empCode = sessionStorage.getItem('e_emp_code');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      if (empCode) {
        fetch(`${API_BASE_URL}/pms/api/e/employee/${empCode}`)
          .then(res => {
            if (!res.ok) throw new Error(`Employee API error: ${res.status}`);
            return res.json();
          })
          .then(data => {
            setUser(data.employeeInfo || data);
          })
          .catch(error => {
            console.error('Error fetching employee info:', error);
            setUser(null);
          });
      } else {
        setUser(null);
      }
    };

    // Initial fetch
    fetchEmployeeInfo();

    // Listen for storage changes (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'e_emp_code') {
        fetchEmployeeInfo();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Listen for navigation or login (same tab)
    const interval = setInterval(() => {
      fetchEmployeeInfo();
    }, 1000); // Poll every second for sessionStorage changes

    // Login time logic
    const loginTime = sessionStorage.getItem('lastLoginTime');
    if (loginTime) {
      try {
        const date = new Date(loginTime);
        setLastLoginTime(date.toLocaleString());
        setLoginDate(date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }));
      } catch (error) {
        console.error('Error parsing login time from sessionStorage:', error);
        sessionStorage.removeItem('lastLoginTime');
        setLastLoginTime('');
        setLoginDate('');
      }
    } else {
      const today = new Date();
      setLoginDate(today.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }));
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Trigger a page reload to refresh all APIs
    setTimeout(() => {
      window.location.reload();
    }, 500); // Small delay to show the refresh animation
  };

  return (
    <div className="h-18 bg-gray-100 px-5 flex items-center justify-between border-b-2 border-[#1d2a56]">
      <div className="text-sm-2 text-gray-800">
        Welcome, <span className="font-bold text-black">{user?.e_fullname || 'No Name'}</span> |
        
         <span className='font-bold text-black px-2'>Login Date:</span>  {loginDate || '-'}
        {/* | Last Login: <span className="font-bold">{lastLoginTime || 'N/A'}</span> */}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <p>Last Updated: <span className='font-bold text-black'>{user?.e_last_login_date}</span></p>
        
        {/* Refresh Button */}
        <button
          className={`ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh all data"
        >
          <svg 
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        
        <button
          className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition"
          onClick={() => {
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('lastLoginTime');
            sessionStorage.removeItem('savedUsername');
            sessionStorage.removeItem('savedPassword');
            sessionStorage.removeItem('e_emp_code');
            sessionStorage.removeItem('e_emp_id');
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
