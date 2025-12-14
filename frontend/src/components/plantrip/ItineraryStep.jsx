// src/components/plantrip/ItineraryStep.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, MapPin, DollarSign } from 'lucide-react';

const ItineraryStep = ({ data, updateData }) => {
  const [days, setDays] = useState([]);

  // Calculate days between start and end date
  useEffect(() => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const daysArray = [];
      for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        daysArray.push({
          dayNumber: i + 1,
          date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          activities: data.itinerary[i]?.activities || []
        });
      }
      setDays(daysArray);
    }
  }, [data.startDate, data.endDate]);

  const addActivity = (dayIndex) => {
    const newActivity = {
      id: Date.now(),
      time: '',
      title: '',
      location: '',
      description: '',
      cost: '',
      category: 'activity'
    };

    const updatedDays = [...days];
    updatedDays[dayIndex].activities.push(newActivity);
    setDays(updatedDays);
    updateData('itinerary', updatedDays);
  };

  const updateActivity = (dayIndex, activityIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities[activityIndex][field] = value;
    setDays(updatedDays);
    updateData('itinerary', updatedDays);
  };

  const deleteActivity = (dayIndex, activityIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.splice(activityIndex, 1);
    setDays(updatedDays);
    updateData('itinerary', updatedDays);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Build Your Itinerary</h3>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">Plan activities for each day of your trip</p>
      </div>

      {days.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
          <p className="text-gray-500 dark:text-gray-400 transition-colors">Please complete Trip Details first to see your itinerary days</p>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 transition-colors">
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Day {day.dayNumber}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{day.date}</p>
                </div>
                <button
                  onClick={() => addActivity(dayIndex)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  <Plus size={16} />
                  Add Activity
                </button>
              </div>

              {/* Activities */}
              {day.activities.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                  <p className="text-gray-400 dark:text-gray-500 text-sm transition-colors">No activities yet. Click "Add Activity" to start planning.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activity.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-gray-900 dark:text-white transition-colors">Activity {activityIndex + 1}</h5>
                        <button
                          onClick={() => deleteActivity(dayIndex, activityIndex)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        {/* Time */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Time</label>
                          <div className="relative">
                            <Clock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={16} />
                            <input
                              type="time"
                              value={activity.time}
                              onChange={(e) => updateActivity(dayIndex, activityIndex, 'time', e.target.value)}
                              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Category</label>
                          <select
                            value={activity.category}
                            onChange={(e) => updateActivity(dayIndex, activityIndex, 'category', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                          >
                            <option value="transport">🚗 Transport</option>
                            <option value="accommodation">🏨 Accommodation</option>
                            <option value="food">🍽️ Food</option>
                            <option value="activity">🎯 Activity</option>
                            <option value="shopping">🛍️ Shopping</option>
                            <option value="other">📌 Other</option>
                          </select>
                        </div>

                        {/* Title */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Activity Title *</label>
                          <input
                            type="text"
                            value={activity.title}
                            onChange={(e) => updateActivity(dayIndex, activityIndex, 'title', e.target.value)}
                            placeholder="e.g., Visit Tanah Lot Temple"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                          />
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Location</label>
                          <div className="relative">
                            <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={16} />
                            <input
                              type="text"
                              value={activity.location}
                              onChange={(e) => updateActivity(dayIndex, activityIndex, 'location', e.target.value)}
                              placeholder="e.g., Tanah Lot, Tabanan"
                              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Cost */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Cost (USD)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={16} />
                            <input
                              type="number"
                              value={activity.cost}
                              onChange={(e) => updateActivity(dayIndex, activityIndex, 'cost', e.target.value)}
                              placeholder="0"
                              min="0"
                              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Description</label>
                          <textarea
                            value={activity.description}
                            onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                            placeholder="Add notes or details..."
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryStep;