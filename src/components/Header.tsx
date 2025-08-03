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
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get user information from sessionStorage
    const userData = sessionStorage.getItem('currentUser');
    const loginTime = sessionStorage.getItem('lastLoginTime');
    // Removed mockUsers and savedUsername fallback logic
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from sessionStorage:', error);
        // Clear invalid data
        sessionStorage.removeItem('currentUser');
        setUser(null);
      }
    }
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
      // Set login date as today if no login time is stored
      const today = new Date();
      setLoginDate(today.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }));
    }
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
