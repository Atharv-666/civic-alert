import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Plus, LogIn, UserPlus, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenReport }) => {
  const location = useLocation();
  const { user, logoutUser } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/feed', label: 'Community Feed' },
    { path: '/my-reports', label: 'My Reports' },
    { path: '/about', label: 'About Us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Civic<span className="text-blue-400">Alert</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Controls & Primary Action Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200">
                  <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-xs font-semibold">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition border border-slate-700 flex items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            <button
              onClick={onOpenReport}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-1 px-2 rounded-md ${
                isActive(item.path) ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/admin/login" className="text-indigo-400 font-semibold py-1 px-2">
            Admin Portal 🛡️
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
