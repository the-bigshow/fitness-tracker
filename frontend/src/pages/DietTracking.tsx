import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/localStorage';
import { Apple, Plus, PieChart, Coffee, Sun, Moon } from 'lucide-react';

export default function DietTracking() {
  const { user } = useAuth();
  const dietLogs = user ? storage.getDietLogs(user.id) : [];
  const [selectedMeal, setSelectedMeal] = useState<string>('all');

  const meals = [
    { id: 'all', name: 'All Meals', icon: Apple },
    { id: 'breakfast', name: 'Breakfast', icon: Sun },
    { id: 'lunch', name: 'Lunch', icon: Coffee },
    { id: 'dinner', name: 'Dinner', icon: Moon },
  ];

  const filteredLogs = selectedMeal === 'all' 
    ? dietLogs 
    : dietLogs.filter(log => log.mealType === selectedMeal);

  const totalNutrition = filteredLogs.reduce((acc, log) => ({
    calories: (acc.calories || 0) + (log.calories || 0),
    protein: (acc.protein || 0) + (log.protein || 0),
    carbs: (acc.carbs || 0) + (log.carbs || 0),
    fats: (acc.fats || 0) + (log.fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Diet Tracking</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Log Meal</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="border-b">
              <div className="flex overflow-x-auto p-4 space-x-4">
                {meals.map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedMeal === meal.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <meal.icon className="w-4 h-4" />
                    <span>{meal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Apple className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No meals logged</h3>
                  <p className="text-gray-600 mb-6">Start tracking your nutrition</p>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Log First Meal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogs.map(log => (
                    <div key={log.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-xl">
                            <Apple className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{log.foodName}</h3>
                            <p className="text-gray-500">{log.mealType}</p>
                          </div>
                        </div>
                        <p className="text-lg font-semibold">{log.calories} kcal</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Protein</p>
                          <p className="font-semibold">{log.protein}g</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Carbs</p>
                          <p className="font-semibold">{log.carbs}g</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Fats</p>
                          <p className="font-semibold">{log.fats}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <PieChart className="w-6 h-6 mr-2 text-green-600" />
            Nutrition Summary
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-500 mb-1">Total Calories</p>
              <p className="text-2xl font-bold">{totalNutrition.calories} kcal</p>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Protein</p>
                <p className="text-xl font-semibold">{totalNutrition.protein}g</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Carbs</p>
                <p className="text-xl font-semibold">{totalNutrition.carbs}g</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Fats</p>
                <p className="text-xl font-semibold">{totalNutrition.fats}g</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}