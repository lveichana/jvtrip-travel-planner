// src/components/plantrip/TripDetailsStep.jsx
import React from 'react';
import { Calendar, MapPin, DollarSign, Image, FileText } from 'lucide-react';

const TripDetailsStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Trip Details</h3>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">Tell us about your trip destination and dates</p>
      </div>

      {/* Trip Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
          Trip Name <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.tripName}
          onChange={(e) => updateData('tripName', e.target.value)}
          placeholder="e.g., Bali Summer Adventure 2025"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
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
            value={data.destination}
            onChange={(e) => updateData('destination', e.target.value)}
            placeholder="e.g., Bali, Indonesia"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
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
              value={data.startDate}
              onChange={(e) => updateData('startDate', e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
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
              value={data.endDate}
              onChange={(e) => updateData('endDate', e.target.value)}
              min={data.startDate}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
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
            value={data.totalBudget}
            onChange={(e) => updateData('totalBudget', e.target.value)}
            placeholder="1000"
            min="0"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Enter your estimated total budget in USD</p>
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
            value={data.coverImage || ''}
            onChange={(e) => updateData('coverImage', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Paste an image URL (e.g., from Unsplash, Imgur, etc.)</p>
        
        {/* Image Preview */}
        {data.coverImage && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">Preview:</p>
            <img 
              src={data.coverImage} 
              alt="Cover preview" 
              className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 hidden transition-colors">⚠️ Invalid image URL</p>
          </div>
        )}
      </div>

      {/* Description (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
          Description <span className="text-gray-400 dark:text-gray-500 transition-colors">(Optional)</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 transition-colors" size={20} />
          <textarea
            value={data.description}
            onChange={(e) => updateData('description', e.target.value)}
            placeholder="Tell us more about this trip..."
            rows="4"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default TripDetailsStep;