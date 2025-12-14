// src/services/tripService.js
import api from './api';

const tripService = {
  // Get all trips for current user
  getAllTrips: async () => {
    try {
      const response = await api.get('/trips');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get trips by status (wishlist, in-progress, completed)
  getTripsByStatus: async (status) => {
    try {
      const response = await api.get(`/trips?status=${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single trip by ID
  getTripById: async (id) => {
    try {
      const response = await api.get(`/trips/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new trip
  createTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update trip
  updateTrip: async (id, tripData) => {
    try {
      const response = await api.put(`/trips/${id}`, tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete trip
  deleteTrip: async (id) => {
    try {
      const response = await api.delete(`/trips/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current in-progress trip
  getCurrentTrip: async () => {
    try {
      const response = await api.get('/trips/current');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default tripService;