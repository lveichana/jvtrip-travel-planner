// src/pages/AddDestination.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Image, Sparkles, Target } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const AddDestination = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tripName: '',
    destination: '',
    status: 'wishlist',
    startDate: '',
    endDate: '',
    totalBudget: '',
    coverImage: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.tripName || !formData.destination) {
      setError('Trip name and destination are required');
      setLoading(false);
      return;
    }

    if (formData.status === 'in-progress') {
      if (!formData.startDate || !formData.endDate || !formData.totalBudget) {
        setError('For "Plan Now", dates and budget are required');
        setLoading(false);
        return;
      }
    }

    try {
      if (formData.status === 'wishlist') {
        // Wishlist: Langsung save ke database (ga perlu itinerary)
        const payload = {
          title: formData.tripName,
          destination: formData.destination,
          status: 'wishlist',
          startDate: null,
          endDate: null,
          totalBudget: null,
          coverImage: formData.coverImage || null,
        };
        await api.post('/trips', payload);
        alert('✨ Destination added to your Wishlist!');
        if (fromAllTrips) {
          navigate('/trips');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Plan Now: Simpan ke localStorage dulu, belum ke database
        localStorage.setItem('tempTrip', JSON.stringify({
          tripName: formData.tripName,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalBudget: formData.totalBudget,
          coverImage: formData.coverImage,
        }));
        
        alert('🎯 Let\'s plan your itinerary!');
        navigate('/plan-trip/new'); // 'new' = indicator dari localStorage
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const fromAllTrips = location.state?.from === 'all-trips' || document.referrer.includes('/trips');
  const backLabel = fromAllTrips ? 'Back to All Trips' : 'Back to Dashboard';

  const handleBack = () => {
    if (formData.tripName || formData.destination) {
      if (window.confirm('Are you sure? Your changes will be lost.')) {
        if (fromAllTrips) {
          navigate('/trips');
        } else {
          navigate('/dashboard');
        }
      }
    } else {
      if (fromAllTrips) {
        navigate('/trips');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const isFormValid = () => {
    if (!formData.tripName || !formData.destination) return false;
    
    if (formData.status === 'in-progress') {
      return formData.startDate && formData.endDate && formData.totalBudget;
    }
    
    return true;
  };
  
  const handleAddDestination = () => {
    navigate('/add-destination');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar onAddDestination={handleAddDestination} />
      
        
        <main className="flex-1 p-8 transition-all duration-300 flex items-start justify-center">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <button 
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                {backLabel}
              </button>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Add New Destination ✈️</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">Where are you dreaming of going?</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg transition-colors">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-6 transition-colors">
              
              {/* Status Selector */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 transition-colors">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 transition-colors">
                  What would you like to do? <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange('status', 'wishlist')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.status === 'wishlist'
                        ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-lg scale-105'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className={formData.status === 'wishlist' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'} size={24} />
                      <div>
                        <h3 className={`font-bold text-lg ${formData.status === 'wishlist' ? 'text-purple-900 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'} transition-colors`}>
                          Add to Wishlist
                        </h3>
                        <p className={`text-sm mt-1 ${formData.status === 'wishlist' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'} transition-colors`}>
                          Save for later planning
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('status', 'in-progress')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.status === 'in-progress'
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-lg scale-105'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Target className={formData.status === 'in-progress' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} size={24} />
                      <div>
                        <h3 className={`font-bold text-lg ${formData.status === 'in-progress' ? 'text-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'} transition-colors`}>
                          Plan Now
                        </h3>
                        <p className={`text-sm mt-1 ${formData.status === 'in-progress' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} transition-colors`}>
                          Start planning immediately
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trip Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Trip Name <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tripName}
                  onChange={(e) => handleChange('tripName', e.target.value)}
                  placeholder="e.g., Bali Summer Adventure 2025"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  disabled={loading}
                  required
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Destination <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    placeholder="e.g., Bali, Indonesia"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {formData.status === 'in-progress' && (
                <div className="space-y-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 transition-colors">
                    <Target size={20} />
                    <span className="font-semibold">Trip Planning Details</span>
                  </div>

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        Start Date <span className="text-red-500 dark:text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={20} />
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleChange('startDate', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        End Date <span className="text-red-500 dark:text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={20} />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleChange('endDate', e.target.value)}
                          min={formData.startDate}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Total Budget <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={20} />
                      <input
                        type="number"
                        value={formData.totalBudget}
                        onChange={(e) => handleChange('totalBudget', e.target.value)}
                        placeholder="1000"
                        min="0"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Cover Image URL <span className="text-gray-400 dark:text-gray-500 transition-colors">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" size={20} />
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => handleChange('coverImage', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid() || loading}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  isFormValid() && !loading
                    ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Saving...' : formData.status === 'wishlist' 
                  ? '✨ Add to Wishlist' 
                  : '🎯 Create Trip & Plan Itinerary'
                }
              </button>
              </div>
            </form>
          </div>
        </main>
    </div>
  );
};

export default AddDestination;