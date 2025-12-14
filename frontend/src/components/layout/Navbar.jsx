// src/components/layout/Navbar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Plus, Home, List, LogOut, Plane, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeProvider';

const Navbar = ({ onAddDestination }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/trips', label: 'All Trips', icon: List },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg transition-colors">
              <Plane className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">JVTrip</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Travel Planner</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Add Destination Button */}
            <button
              onClick={onAddDestination}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
            >
              <Plus size={18} />
              Add Trip
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
                  <User size={18} className="text-white" />
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={onAddDestination}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
          >
            <Plus size={20} />
            <span className="text-xs font-medium">Add</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;