import React, { useState, useEffect } from 'react';
import { mockUsers } from '../lib/mockAPIData';

interface User {
  username: string;
  name: string;
  emp_code: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lastLoginTime, setLastLoginTime] = useState<string>('');
  const [loginDate, setLoginDate] = useState<string>('');

  useEffect(() => {
    // Get user information from localStorage
    const userData = localStorage.getItem('currentUser');
    const loginTime = localStorage.getItem('lastLoginTime');
    const savedUsername = localStorage.getItem('savedUsername');
    
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
    } else if (savedUsername) {
      // Fallback to saved username if currentUser is not available
      const foundUser = mockUsers.find(u => u.username === savedUsername);
      if (foundUser) {
        setUser(foundUser);
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
        Welcome, <span className="font-bold text-black">{user?.name || 'User'}</span> |
        Login Date: {loginDate || '-'}
        
        {/* | Last Login: <span className="font-bold">{lastLoginTime || 'N/A'}</span> */}
      
      
      </div>
      <div className="text-xs text-gray-600">
        {/* <p>Logged in as: <strong>{user ? user.name : 'Unknown User'}</strong></p> */}
        {/* <p>Login Date: {loginDate || '-'}</p> */}
        <p>Last Updated: 24 June 2025 at 6:30 PM</p>
      </div>
    </div>
  );
};

export default Header;
