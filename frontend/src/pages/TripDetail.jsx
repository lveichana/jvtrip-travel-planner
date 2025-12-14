// src/pages/TripDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Clock, TrendingUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Detect where user came from
  const fromAllTrips = location.state?.from === 'all-trips' || document.referrer.includes('/trips');
  const backLabel = fromAllTrips ? 'Back to All Trips' : 'Back to Dashboard';

  const handleBack = () => {
    if (fromAllTrips) {
      navigate('/trips');
    } else {
      // Navigate to dashboard with the trip's status tab
      navigate('/dashboard', { state: { activeTab: tripData?.status } });
    }
  };

  useEffect(() => {
    fetchTripDetail();
  }, [id]);

  const fetchTripDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${id}`);
      setTripData(response.data.trip);
      setError('');
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4 transition-colors">{error || 'Trip not found'}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            {backLabel}
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    completed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    wishlist: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  };

  const statusLabels = {
    'in-progress': 'In Progress',
    completed: 'Completed',
    wishlist: 'Wishlist',
  };

  const categoryIcons = {
    transport: '🚗',
    accommodation: '🏨',
    food: '🍽️',
    activity: '🎯',
    shopping: '🛍️',
    other: '📌'
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'budget', label: 'Budget' },
  ];

  const budgetPercentage = tripData.budget 
    ? (tripData.budget.spent / tripData.budget.total) * 100 
    : 0;

  const duration = tripData.start_date && tripData.end_date
    ? Math.ceil((new Date(tripData.end_date) - new Date(tripData.start_date)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar onAddDestination={() => navigate('/plan-trip')} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Smart Back Button */}
        <div className="mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            {backLabel}
          </button>
        </div>

        {/* Trip Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 transition-colors">
          <div className="relative h-64">
            <img 
              src={tripData.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} 
              alt={tripData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{tripData.title}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {tripData.destination}
                    </span>
                    {tripData.start_date && tripData.end_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(tripData.start_date).toLocaleDateString()} - {new Date(tripData.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${statusColors[tripData.status]}`}>
                  {statusLabels[tripData.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 transition-colors">
            {tripData.status === 'in-progress' && (
              <button
                onClick={() => navigate(`/plan-trip/${id}`)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Edit size={18} />
                Edit Trip
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {tripData.description && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 transition-colors">About This Trip</h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors">{tripData.description}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  {duration > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 transition-colors">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2 transition-colors">
                        <Calendar size={20} />
                        <span className="font-semibold">Duration</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 transition-colors">{duration} Days</p>
                    </div>
                  )}

                  {tripData.total_budget && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 transition-colors">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2 transition-colors">
                        <DollarSign size={20} />
                        <span className="font-semibold">Budget</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-300 transition-colors">${tripData.total_budget}</p>
                    </div>
                  )}

                  {tripData.budget && (
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 transition-colors">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2 transition-colors">
                        <TrendingUp size={20} />
                        <span className="font-semibold">Spent</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-300 transition-colors">${tripData.budget.spent}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                {!tripData.itinerary || tripData.itinerary.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
                    <p className="text-gray-500 dark:text-gray-400 transition-colors">No itinerary planned yet</p>
                  </div>
                ) : (
                  tripData.itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Day {day.day}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex gap-3 flex-1">
                                {activity.time && (
                                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm min-w-[60px] transition-colors">
                                    <Clock size={14} />
                                    {activity.time}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{categoryIcons[activity.category]}</span>
                                    <h4 className="font-semibold text-gray-900 dark:text-white transition-colors">{activity.title}</h4>
                                  </div>
                                  {activity.location && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 transition-colors">
                                      <MapPin size={12} />
                                      {activity.location}
                                    </p>
                                  )}
                                  {activity.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{activity.description}</p>
                                  )}
                                </div>
                              </div>
                              {activity.cost > 0 && (
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors">${activity.cost}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'budget' && (
              <div className="space-y-6">
                {tripData.budget ? (
                  <>
                    {/* Budget Summary */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-colors">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors">Total Budget</span>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-2 transition-colors">${tripData.budget.total}</p>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 transition-colors">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-400 transition-colors">Total Spent</span>
                        <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-2 transition-colors">${tripData.budget.spent}</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 transition-colors">{budgetPercentage.toFixed(1)}% used</p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 transition-colors">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400 transition-colors">Remaining</span>
                        <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-2 transition-colors">${tripData.budget.total - tripData.budget.spent}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-900 dark:text-white transition-colors">Budget Usage</span>
                        <span className="text-gray-600 dark:text-gray-400 transition-colors">{budgetPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden transition-colors">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 h-full transition-all duration-500"
                          style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    {tripData.budget.breakdown && Object.keys(tripData.budget.breakdown).length > 0 && (
                      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4 transition-colors">Spending by Category</h4>
                        <div className="space-y-4">
                          {Object.entries(tripData.budget.breakdown).map(([category, amount]) => (
                            amount > 0 && (
                              <div key={category}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{categoryIcons[category]}</span>
                                    <span className="font-medium text-gray-900 dark:text-white capitalize transition-colors">{category}</span>
                                  </div>
                                  <span className="font-bold text-gray-900 dark:text-white transition-colors">${amount}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors">
                                  <div 
                                    className="bg-blue-500 dark:bg-blue-400 h-full rounded-full transition-all"
                                    style={{ width: `${(amount / tripData.budget.total) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
                    <p className="text-gray-500 dark:text-gray-400 transition-colors">No budget information available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetail;