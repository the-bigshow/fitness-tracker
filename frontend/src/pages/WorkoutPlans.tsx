import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/localStorage';
import { Dumbbell, Calendar, Clock, Plus, ChevronRight } from 'lucide-react';

export default function WorkoutPlans() {
  const { user } = useAuth();
  const workoutPlans = user ? storage.getWorkoutPlans(user.id) : [];
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredPlans = workoutPlans.filter(plan => plan.dayOfWeek === selectedDay);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workout Plans</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Plan</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto p-4 space-x-4">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No workouts planned</h3>
              <p className="text-gray-600 mb-6">Create your first workout plan for {selectedDay}</p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Add Workout
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPlans.map(plan => (
                <div key={plan.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <Dumbbell className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="mt-4 flex items-center space-x-6">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{plan.dayOfWeek}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">45 mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}