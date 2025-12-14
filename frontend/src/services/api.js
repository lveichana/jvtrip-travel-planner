// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export default untuk compatibility
export default api;

// ============================================
// TRIPS APIs
// ============================================
export const tripsAPI = {
  // Get all trips
  getAll: () => api.get('/trips'),
  
  // Get trips by category (upcoming, ongoing, past)
  getByCategory: (category) => api.get(`/trips?category=${category}`),
  
  // Get single trip
  getById: (id) => api.get(`/trips/${id}`),
  
  // Create new trip
  create: (tripData) => api.post('/trips', tripData),
  
  // Update trip
  update: (id, tripData) => api.put(`/trips/${id}`, tripData),
  
  // Delete trip
  delete: (id) => api.delete(`/trips/${id}`),
};

// ============================================
// ACTIVITIES APIs
// ============================================
export const activitiesAPI = {
  // Get all activities for a trip
  getByTripId: (tripId) => api.get(`/trips/${tripId}/activities`),
  
  // Create new activity
  create: (tripId, activityData) => 
    api.post(`/trips/${tripId}/activities`, activityData),
  
  // Update activity
  update: (tripId, activityId, activityData) => 
    api.put(`/trips/${tripId}/activities/${activityId}`, activityData),
  
  // Delete activity
  delete: (tripId, activityId) => 
    api.delete(`/trips/${tripId}/activities/${activityId}`),
  
  // Toggle activity completion
  toggleComplete: (tripId, activityId) => 
    api.patch(`/trips/${tripId}/activities/${activityId}/toggle`),
};

// ============================================
// UTILITY
// ============================================
export const healthCheck = () => api.get('/health');