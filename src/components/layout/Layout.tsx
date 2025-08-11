import React from 'react';
import Sidebar from '../SideMenuBar';
import Header from '../Header';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => (
  <div className="flex h-screen overflow-hidden font-sans bg-gray-100">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Header />
      <div className="p-2 bg-white overflow-y-auto flex-1" id="contentArea">
        <Outlet />
      </div>
    </div>
  </div>
);

export default Layout;
