// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, TrendingUp, MapPin, Calendar } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import TripCard from '../components/dashboard/TripCard';
import InProgressCard from '../components/dashboard/InProgressCard';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('wishlist');
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set active tab from navigation state if available
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    // Filter trips when tab changes
    const filtered = allTrips.filter(t => t.status === activeTab);
    // Sort: pinned trips first, then by created_at
    const sorted = filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setTrips(sorted);
  }, [activeTab, allTrips]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      const fetchedTrips = response.data.trips || [];
      
      setAllTrips(fetchedTrips);
      
      // Get current in-progress trip
      const inProgress = fetchedTrips.find(t => t.status === 'in-progress');
      setCurrentTrip(inProgress || null);
      
      setError('');
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'wishlist', label: 'Wishlist', color: 'purple' },
    { id: 'in-progress', label: 'In Progress', color: 'blue' },
    { id: 'completed', label: 'Completed', color: 'green' },
  ];

  const colorClasses = {
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
  };

  const currentColor = colorClasses[tabs.find(t => t.id === activeTab)?.color || 'blue'];

  // Calculate stats
  const stats = [
    { 
      label: 'Total Trips', 
      value: allTrips.length, 
      icon: MapPin,
      color: 'blue'
    },
    { 
      label: 'Active', 
      value: allTrips.filter(t => t.status === 'in-progress').length, 
      icon: TrendingUp,
      color: 'green'
    },
    { 
      label: 'Wishlist', 
      value: allTrips.filter(t => t.status === 'wishlist').length, 
      icon: Calendar,
      color: 'purple'
    },
  ];

  const handlePlan = (id) => {
    navigate(`/plan-trip/${id}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/trip/${id}`, { state: { from: 'dashboard' } });
  };

  const handleEdit = (id) => {
    navigate(`/plan-trip/${id}`);
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await api.put(`/trips/${id}`, { status: newStatus });
      fetchTrips();
    } catch (err) {
      console.error('Error changing status:', err);
      alert('Failed to change trip status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await api.delete(`/trips/${id}`);
        fetchTrips();
      } catch (err) {
        console.error('Error deleting trip:', err);
        alert('Failed to delete trip');
      }
    }
  };

  const handlePin = async (id) => {
    try {
      const tripToPin = allTrips.find(t => t.id === id);
      await api.put(`/trips/${id}`, { is_pinned: !tripToPin?.is_pinned });
      fetchTrips();
    } catch (err) {
      console.error('Error pinning trip:', err);
      alert('Failed to pin trip');
    }
  };

  const handleAddDestination = () => {
    navigate('/add-destination', { state: { from: 'dashboard' } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar onAddDestination={handleAddDestination} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Welcome back 👋</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Plan your next adventure</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg transition-colors">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md dark:hover:shadow-gray-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/30 transition-colors`}>
                  <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400 transition-colors`} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? `${currentColor.badge} shadow-sm`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {trips.length > 4 && (
            <button
              onClick={() => navigate(`/trips/${activeTab}`)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              View All →
            </button>
          )}
        </div>

        {/* Trips Grid - 2 Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Trips Grid */}
          <div className="lg:col-span-2">
            <div className={`${currentColor.bg} ${currentColor.border} border-2 rounded-xl p-6 min-h-[400px] transition-colors`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                    {trips.length} {trips.length === 1 ? 'destination' : 'destinations'}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 dark:border-gray-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors">Loading trips...</p>
                  </div>
                </div>
              ) : trips.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm transition-colors">
                      <Plus size={32} className="text-gray-400 dark:text-gray-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">No trips yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">Start planning your dream adventure</p>
                    <button 
                      onClick={handleAddDestination}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <Plus size={20} />
                      Add Your First Trip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {trips.slice(0, 4).map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={{ ...trip, image: trip.cover_image }}
                      onPlan={handlePlan}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onChangeStatus={handleChangeStatus}
                      onDelete={handleDelete}
                      onPin={handlePin}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Current Trip Detail (ALWAYS SHOW) */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 sticky top-24 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors">Current Trip</h3>
                {currentTrip && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full transition-colors">
                    Active
                  </span>
                )}
              </div>
              
              {currentTrip ? (
                <InProgressCard 
                  trip={{ ...currentTrip, image: currentTrip.cover_image }}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center transition-colors">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <MapPin size={24} className="text-gray-400 dark:text-gray-500 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">No Active Trip</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
                    Your current in-progress trip will appear here
                  </p>
                  <button
                    onClick={handleAddDestination}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Start Planning →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;