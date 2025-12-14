// src/components/plantrip/BudgetStep.jsx
import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const BudgetStep = ({ data }) => {
  const [budgetSummary, setBudgetSummary] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    breakdown: {
      transport: 0,
      accommodation: 0,
      food: 0,
      activity: 0,
      shopping: 0,
      other: 0,
    }
  });

  useEffect(() => {
    // Calculate total spent from itinerary
    let totalSpent = 0;
    const breakdown = {
      transport: 0,
      accommodation: 0,
      food: 0,
      activity: 0,
      shopping: 0,
      other: 0,
    };

    if (data.itinerary && data.itinerary.length > 0) {
      data.itinerary.forEach(day => {
        if (day.activities) {
          day.activities.forEach(activity => {
            const cost = parseFloat(activity.cost) || 0;
            totalSpent += cost;
            breakdown[activity.category] = (breakdown[activity.category] || 0) + cost;
          });
        }
      });
    }

    const totalBudget = parseFloat(data.totalBudget) || 0;
    const remaining = totalBudget - totalSpent;

    setBudgetSummary({
      totalBudget,
      totalSpent,
      remaining,
      breakdown
    });
  }, [data.itinerary, data.totalBudget]);

  const getPercentage = (amount) => {
    if (budgetSummary.totalBudget === 0) return 0;
    return ((amount / budgetSummary.totalBudget) * 100).toFixed(1);
  };

  const categories = [
    { id: 'transport', name: 'Transport', icon: '🚗', color: 'bg-blue-500 dark:bg-blue-400' },
    { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: 'bg-purple-500 dark:bg-purple-400' },
    { id: 'food', name: 'Food & Drinks', icon: '🍽️', color: 'bg-orange-500 dark:bg-orange-400' },
    { id: 'activity', name: 'Activities', icon: '🎯', color: 'bg-green-500 dark:bg-green-400' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-500 dark:bg-pink-400' },
    { id: 'other', name: 'Other', icon: '📌', color: 'bg-gray-500 dark:bg-gray-400' },
  ];

  const budgetStatus = budgetSummary.remaining >= 0 ? 'safe' : 'over';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Budget Overview</h3>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">Review your trip expenses and budget allocation</p>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors">Total Budget</span>
            <DollarSign className="text-blue-600 dark:text-blue-500 transition-colors" size={20} />
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 transition-colors">${budgetSummary.totalBudget}</p>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-400 transition-colors">Total Planned</span>
            <TrendingUp className="text-purple-600 dark:text-purple-500 transition-colors" size={20} />
          </div>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 transition-colors">${budgetSummary.totalSpent}</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 transition-colors">{getPercentage(budgetSummary.totalSpent)}% of budget</p>
        </div>

        {/* Remaining */}
        <div className={`bg-gradient-to-br ${
          budgetStatus === 'safe' 
            ? 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800' 
            : 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-800'
        } border-2 rounded-xl p-6 transition-colors`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${budgetStatus === 'safe' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'} transition-colors`}>
              {budgetStatus === 'safe' ? 'Remaining' : 'Over Budget'}
            </span>
            {budgetStatus === 'safe' ? (
              <TrendingDown className="text-green-600 dark:text-green-500 transition-colors" size={20} />
            ) : (
              <AlertCircle className="text-red-600 dark:text-red-500 transition-colors" size={20} />
            )}
          </div>
          <p className={`text-3xl font-bold ${budgetStatus === 'safe' ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'} transition-colors`}>
            ${Math.abs(budgetSummary.remaining)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-900 dark:text-white transition-colors">Budget Usage</span>
          <span className="text-gray-600 dark:text-gray-400 transition-colors">{getPercentage(budgetSummary.totalSpent)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden transition-colors">
          <div 
            className={`h-full transition-all duration-500 ${
              budgetStatus === 'safe' ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
            }`}
            style={{ width: `${Math.min(getPercentage(budgetSummary.totalSpent), 100)}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4 transition-colors">Budget Breakdown by Category</h4>
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors">{category.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white transition-colors">
                  ${budgetSummary.breakdown[category.id] || 0}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden transition-colors">
                  <div 
                    className={`${category.color} h-full transition-all duration-500`}
                    style={{ width: `${getPercentage(budgetSummary.breakdown[category.id])}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right transition-colors">
                  {getPercentage(budgetSummary.breakdown[category.id])}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Alert */}
      {budgetStatus === 'over' && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 transition-colors">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1 transition-colors" size={20} />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300 transition-colors">Over Budget!</p>
            <p className="text-sm text-red-700 dark:text-red-400 transition-colors">
              Your planned expenses exceed your budget by ${Math.abs(budgetSummary.remaining)}. 
              Consider adjusting your itinerary or increasing your budget.
            </p>
          </div>
        </div>
      )}

      {/* Summary Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 transition-colors">
        <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors">
          💡 <strong>Tip:</strong> This is your planned budget based on your itinerary. 
          You can track actual expenses during your trip from the trip detail page.
        </p>
      </div>
    </div>
  );
};

export default BudgetStep;