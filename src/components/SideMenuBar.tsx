import React from 'react';
import Logo from '../assets/logo/FocusFrame360.png'
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: 'fa-home', label: 'Home', path: '/app/home' },
  { icon: 'fa-user-tag', label: 'My Role', path: '/app/role' },
  { icon: 'fa-bullseye', label: 'My Goals', path: '/app/mygoals' },
  { icon: 'fa-calendar-week', label: 'Week Summary', path: '/app/weeklysummary' },
  { icon: 'fa-tasks', label: 'Goal Actions', path: '/app/actions' },
  { icon: 'fa-trophy', label: 'Performance', path: '/app/performance' },
  { icon: 'fa-file-alt', label: 'Files', path: '/app/files' },
  { icon: 'fa-ellipsis-h', label: 'More', path: '/app/more' },
  { icon: 'fa-cogs', label: 'Operations', path: '/app/operations' },
  { icon: 'fa-chart-bar', label: 'Reports', path: '/app/profile' },
];

const SideMenuBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div 
      className="w-20 bg-[#1d2a56] text-white flex flex-col items-center pt-3 h-screen overflow-y-auto" 
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none'
      }}
    >
      <div className="mb-5 p-2">
        <img src={Logo} alt="FocusFrame360 Logo" className="w-12" />
      </div>

      {navItems.map((item) => (
        <div
          key={item.path}
          className={`text-center text-xs cursor-pointer py-2 w-full flex flex-col items-center justify-center transition-colors ${
            location.pathname === item.path
              ? 'bg-orange-400 text-black'
              : 'hover:bg-orange-400 hover:text-black'
          }`}
          onClick={() => navigate(item.path)}
        >
          <i className={`fas ${item.icon} text-base mb-2`}></i>
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SideMenuBar;
