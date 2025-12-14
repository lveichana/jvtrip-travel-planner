// src/components/dashboard/TripCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Trash2, MoreVertical, Edit, Eye, Calendar, Target, Archive } from 'lucide-react';

const TripCard = ({ trip, onPlan, onDelete, onViewDetails, onEdit, onChangeStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const tagColors = {
    wishlist: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    completed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
  };

  const tagLabels = {
    wishlist: 'Wishlist',
    'in-progress': 'In Progress',
    completed: 'Completed'
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleStatusChange = (newStatus) => {
    setMenuOpen(false);
    if (onChangeStatus) {
      const statusLabels = {
        wishlist: 'Wishlist',
        'in-progress': 'In Progress',
        completed: 'Completed'
      };
      if (window.confirm(`Move this trip to ${statusLabels[newStatus]}?`)) {
        onChangeStatus(trip.id, newStatus);
      }
    }
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(trip.id);
  };

  const statusMenuOptions = {
    wishlist: [
      { label: 'Move to In Progress', status: 'in-progress', icon: Target },
      { label: 'Move to Past Trips', status: 'completed', icon: Archive },
    ],
    'in-progress': [
      { label: 'Move to Wishlist', status: 'wishlist', icon: Calendar },
      { label: 'Mark as Completed', status: 'completed', icon: Archive },
    ],
    completed: [
      { label: 'Plan Again (Wishlist)', status: 'wishlist', icon: Calendar },
      { label: 'Move to In Progress', status: 'in-progress', icon: Target },
    ],
  };

  const currentMenuOptions = statusMenuOptions[trip.status] || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 transition-all overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 relative">
      <img 
        src={trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} 
        alt={trip.title} 
        className="w-full h-40 object-cover" 
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex-1 transition-colors">{trip.title || trip.name}</h3>
          
          {/* 3-Dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="More options"
            >
              <MoreVertical size={18} className="text-gray-600 dark:text-gray-400 transition-colors" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-8 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 py-2 z-10 transition-colors">
                {/* Status Change Options */}
                {currentMenuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleStatusChange(option.status)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                  >
                    <option.icon size={16} className="text-gray-500 dark:text-gray-400 transition-colors" />
                    {option.label}
                  </button>
                ))}
                
                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-2 transition-colors"></div>
                
                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Trip
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">
          <MapPin size={14} />
          <span>{trip.destination || trip.country}</span>
        </div>
        
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-3 transition-colors ${tagColors[trip.status] || tagColors.wishlist}`}>
          {tagLabels[trip.status] || tagLabels.wishlist}
        </span>
        
        {/* Action Buttons Based on Status */}
        <div className="flex gap-2 mt-4">
          {trip.status === 'wishlist' && (
            <button 
              onClick={() => onPlan(trip.id)}
              className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Plan This Trip
            </button>
          )}
          
          {(trip.status === 'in-progress' || trip.status === 'completed') && (
            <>
              <button
                onClick={() => onViewDetails(trip.id)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View
              </button>
              
              {trip.status === 'in-progress' && (
                <button
                  onClick={() => onEdit(trip.id)}
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;