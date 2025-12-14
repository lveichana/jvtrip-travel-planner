// src/hooks/useTrips.js
import { useState, useEffect } from 'react';
import tripService from '../services/tripService';

export const useTrips = (status = null) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TEMPORARY: Mock data untuk testing
      const mockData = {
        trips: [
          { id: 1, title: 'Bali Trip', destination: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', status: status || 'wishlist' },
          { id: 2, title: 'Tokyo Adventure', destination: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', status: status || 'wishlist' },
          { id: 3, title: 'Paris Getaway', destination: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', status: status || 'wishlist' },
          { id: 4, title: 'Santorini Escape', destination: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400', status: status || 'wishlist' },
          { id: 5, title: 'London Explorer', destination: 'London, UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', status: status || 'wishlist' },
          { id: 6, title: 'New York City', destination: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', status: status || 'wishlist' },
          { id: 7, title: 'Dubai Dreams', destination: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', status: status || 'wishlist' },
          { id: 8, title: 'Iceland Adventure', destination: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400', status: status || 'wishlist' },
        ]
      };
      
      // Uncomment ini kalau backend udah ready:
      // const data = status 
      //   ? await tripService.getTripsByStatus(status)
      //   : await tripService.getAllTrips();
      
      setTrips(mockData.trips || []);
    } catch (err) {
      setError(err.error || 'Failed to fetch trips');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [status]);

  const deleteTrip = async (id) => {
    try {
      await tripService.deleteTrip(id);
      setTrips(trips.filter(trip => trip.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.error || 'Failed to delete trip');
      return { success: false, error: err };
    }
  };

  const refetch = () => {
    fetchTrips();
  };

  return {
    trips,
    loading,
    error,
    deleteTrip,
    refetch,
  };
};

export const useCurrentTrip = () => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentTrip = async () => {
      try {
        setLoading(true);
        
        // TEMPORARY: Mock data untuk testing
        const mockTrip = {
          trip: {
            id: 5,
            name: 'Singapore Adventure',
            destination: 'Singapore',
            image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400',
            itinerary: [
              { day: 1, activity: 'Marina Bay Sands & Gardens by the Bay' },
              { day: 2, activity: 'Universal Studios Singapore' },
              { day: 3, activity: 'Sentosa Island & Beach' },
              { day: 4, activity: 'Chinatown & Little India' },
            ],
            budget: { spent: 500, total: 1000 }
          }
        };
        
        // Uncomment ini kalau backend udah ready:
        // const data = await tripService.getCurrentTrip();
        
        setCurrentTrip(mockTrip.trip || null);
      } catch (err) {
        setError(err.error || 'Failed to fetch current trip');
        console.error('Error fetching current trip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTrip();
  }, []);

  return { currentTrip, loading, error };
};