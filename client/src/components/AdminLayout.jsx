import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex font-sans antialiased">
      {/* Dedicated Isolated Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin View Container (NO Public Navbar / Footer) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
