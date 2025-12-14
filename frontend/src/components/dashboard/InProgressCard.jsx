// src/components/dashboard/InProgressCard.jsx
import React from 'react';
import { MapPin, Calendar, DollarSign, Eye, Edit } from 'lucide-react';

const InProgressCard = ({ trip, onViewDetails, onEdit }) => {
  if (!trip) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400">No trip in progress</p>
      </div>
    );
  }

  const progressPercentage = trip.budget 
    ? (trip.budget.spent / trip.budget.total) * 100 
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <img 
        src={trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} 
        alt={trip.name || trip.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white transition-colors">{trip.name || trip.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">
          <MapPin size={14} />
          <span>{trip.destination}</span>
        </div>

        {trip.itinerary && trip.itinerary.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
              <Calendar size={16} />
              Itinerary
            </h4>
            <div className="space-y-2">
              {trip.itinerary.slice(0, 4).map((item, index) => (
                <div key={index} className="flex gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400 transition-colors">Day {item.day || index + 1}:</span>
                  <span className="text-gray-900 dark:text-white transition-colors">{item.activity || item.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {trip.budget && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
              <DollarSign size={16} />
              Budget
            </h4>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400 transition-colors">${trip.budget.spent} spent</span>
              <span className="text-gray-600 dark:text-gray-400 transition-colors">${trip.budget.total} total</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">{progressPercentage.toFixed(0)}% of budget used</p>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button 
            onClick={() => onViewDetails && onViewDetails(trip.id)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View Details
          </button>
          <button 
            onClick={() => onEdit && onEdit(trip.id)}
            className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InProgressCard;