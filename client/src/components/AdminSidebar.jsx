import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, AlertCircle, CheckCircle2, LogOut, ExternalLink, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Issue Resolution Console', path: '/admin/dashboard', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 font-sans">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg border border-indigo-400/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-tight leading-none">CivicAlert Admin</h1>
            <p className="text-[10px] text-indigo-400 mt-1 font-semibold">Salokhenagar Authority</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Main Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile & Logout Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950">
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="overflow-hidden">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white truncate">{admin?.name || 'Officer'}</span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-indigo-500/30">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">{admin?.email || 'admin@salokhenagar.org'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border border-slate-800 transition"
            title="Open Public Site in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition shrink-0"
            title="Logout Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
