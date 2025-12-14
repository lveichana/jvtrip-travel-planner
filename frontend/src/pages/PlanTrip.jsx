// src/pages/PlanTrip.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import api from '../services/api';
import TripDetailsStep from '../components/plantrip/TripDetailsStep';
import ItineraryStep from '../components/plantrip/ItineraryStep';
import BudgetStep from '../components/plantrip/BudgetStep';

export default function PlanTrip() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tripData, setTripData] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    coverImage: null,
    description: '',
    itinerary: [],
  });

  const steps = [
    { id: 0, name: 'Trip Details', component: TripDetailsStep },
    { id: 1, name: 'Itinerary', component: ItineraryStep },
    { id: 2, name: 'Budget', component: BudgetStep },
  ];

  // Load trip data
  useEffect(() => {
    if (id === 'new') {
      // Load dari localStorage (trip baru dari AddDestination)
      const tempTrip = localStorage.getItem('tempTrip');
      if (tempTrip) {
        const savedData = JSON.parse(tempTrip);
        setTripData({
          tripName: savedData.tripName,
          destination: savedData.destination,
          startDate: savedData.startDate,
          endDate: savedData.endDate,
          totalBudget: savedData.totalBudget,
          coverImage: savedData.coverImage,
          description: '',
          itinerary: [],
        });
      } else {
        alert('No trip data found!');
        navigate('/add-destination');
      }
    } else {
      // Load dari database (edit trip yang udah ada)
      fetchTrip();
    }
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${id}`);
      const trip = response.data.trip;

      // Transform itinerary data from backend format
      const transformedItinerary = trip.itinerary ? trip.itinerary.map(day => ({
        dayNumber: day.day,
        date: day.date,
        activities: day.activities || []
      })) : [];

      setTripData({
        tripName: trip.title || '',
        destination: trip.destination || '',
        startDate: trip.start_date ? trip.start_date.split('T')[0] : '',
        endDate: trip.end_date ? trip.end_date.split('T')[0] : '',
        totalBudget: trip.total_budget || '',
        coverImage: trip.cover_image || null,
        description: trip.description || '',
        itinerary: transformedItinerary,
      });
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const updateData = (field, value) => {
    setTripData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!tripData.tripName || !tripData.destination) {
        setError('Trip name and destination are required');
        return false;
      }
      if (!tripData.startDate || !tripData.endDate) {
        setError('Start and end dates are required');
        return false;
      }
      if (!tripData.totalBudget) {
        setError('Total budget is required');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');

    try {
      const tripPayload = {
        title: tripData.tripName,
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        totalBudget: parseFloat(tripData.totalBudget),
        coverImage: typeof tripData.coverImage === 'string' ? tripData.coverImage : null,
        description: tripData.description,
        status: 'in-progress',
      };

      let tripId;
      
      if (id === 'new') {
        // CREATE: Trip baru dari localStorage
        const response = await api.post('/trips', tripPayload);
        tripId = response.data.trip.id;
        
        // Hapus localStorage setelah berhasil save
        localStorage.removeItem('tempTrip');
      } else {
        // UPDATE: Edit trip yang udah ada
        await api.put(`/trips/${id}`, tripPayload);
        tripId = id;
      }

      // Save all activities from itinerary
      if (tripData.itinerary && tripData.itinerary.length > 0) {
        // Delete all existing activities first if editing
        if (id !== 'new') {
          const existingActivities = await api.get(`/trips/${tripId}/activities`);
          for (const activity of existingActivities.data.activities) {
            await api.delete(`/activities/${activity.id}`);
          }
        }

        // Create new activities
        for (const day of tripData.itinerary) {
          if (day.activities && day.activities.length > 0) {
            for (const activity of day.activities) {
              if (activity.title) {
                await api.post(`/trips/${tripId}/activities`, {
                  dayNumber: day.dayNumber,
                  activityDate: day.date,
                  time: activity.time || null,
                  title: activity.title,
                  location: activity.location || null,
                  description: activity.description || null,
                  cost: parseFloat(activity.cost) || 0,
                  category: activity.category || 'activity',
                });
              }
            }
          }
        }
      }

      alert('🎉 Trip saved successfully!');
      navigate(`/trip/${tripId}`);
    } catch (err) {
      console.error('Error saving trip:', err);
      setError(err.response?.data?.error || 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    if (id === 'new') {
      if (window.confirm('Cancel planning? Your progress will be lost.')) {
        localStorage.removeItem('tempTrip');
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (loading && !tripData.tripName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">Loading trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDashboard}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-900 dark:text-gray-100" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                {id === 'new' ? 'Plan Your Trip' : 'Edit Trip'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      index < currentStep
                        ? 'bg-green-500 dark:bg-green-400 text-white'
                        : index === currentStep
                        ? 'bg-blue-600 dark:bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {index < currentStep ? <Check size={20} /> : index + 1}
                  </div>
                  <span
                    className={`ml-3 font-medium transition-colors ${
                      index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      index < currentStep ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg transition-colors">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors">
          <CurrentStepComponent data={tripData} updateData={updateData} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex-1" />

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:bg-green-300 dark:disabled:bg-green-700 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Finish & Save Trip'}
              <Check size={18} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}