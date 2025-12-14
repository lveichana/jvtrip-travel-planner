// src/pages/AllTrips.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, DollarSign, ArrowUpDown, 
  Filter, Search, Plane, Clock, Eye
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const AllTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter & Sort States
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'name' or 'updated'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [trips, statusFilter, searchQuery, sortBy, sortOrder]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      setTrips(response.data.trips || []);
      setError('');
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...trips];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(trip => trip.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trip => 
        trip.title?.toLowerCase().includes(query) ||
        trip.destination?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.title?.toLowerCase() || '';
        const nameB = b.title?.toLowerCase() || '';
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        // Sort by updated_at
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return sortOrder === 'desc' 
          ? dateB - dateA
          : dateA - dateB;
      }
    });

    setFilteredTrips(result);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleViewDetails = (tripId) => {
    navigate(`/trip/${tripId}`, { state: { from: 'all-trips' } });
  };

  const handleAddDestination = () => {
    navigate('/add-destination', { state: { from: 'all-trips' } });
  };

  const statusColors = {
    'wishlist': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    'completed': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  };

  const statusLabels = {
    'wishlist': 'Wishlist',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };

  const statusCounts = {
    all: trips.length,
    wishlist: trips.filter(t => t.status === 'wishlist').length,
    'in-progress': trips.filter(t => t.status === 'in-progress').length,
    completed: trips.filter(t => t.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">Loading trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar onAddDestination={handleAddDestination} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">All Trips</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">Manage and explore all your travel plans</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 transition-colors">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search trips by name or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500 dark:text-gray-400 transition-colors" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="wishlist">Wishlist ({statusCounts.wishlist})</option>
                <option value="in-progress">In Progress ({statusCounts['in-progress']})</option>
                <option value="completed">Completed ({statusCounts.completed})</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-gray-500 dark:text-gray-400 transition-colors" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="updated">Latest Updated</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">
          Showing {filteredTrips.length} of {trips.length} trips
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 transition-colors">
            <p className="text-red-600 dark:text-red-400 transition-colors">{error}</p>
          </div>
        )}

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors">
            <Plane className="mx-auto text-gray-400 dark:text-gray-500 mb-4 transition-colors" size={48} />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">No trips found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Start planning your first adventure!'
              }
            </p>
            <button
              onClick={() => navigate('/plan-trip')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Create New Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 transition-all overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-colors ${statusColors[trip.status]}`}>
                      {statusLabels[trip.status]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    {trip.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500 dark:text-blue-400 transition-colors" />
                      <span>{trip.destination}</span>
                    </div>

                    {trip.start_date && trip.end_date && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500 dark:text-purple-400 transition-colors" />
                        <span>
                          {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}

                    {trip.total_budget && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-500 dark:text-green-400 transition-colors" />
                        <span>${trip.total_budget}</span>
                      </div>
                    )}

                    {trip.updated_at && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 transition-colors">
                        <Clock size={14} />
                        <span>Updated {new Date(trip.updated_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {trip.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 transition-colors">
                      {trip.description}
                    </p>
                  )}

                  {/* View Button - pushed to bottom */}
                  <button
                    onClick={() => handleViewDetails(trip.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllTrips;