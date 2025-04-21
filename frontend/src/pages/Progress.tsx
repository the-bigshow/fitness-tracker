import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/localStorage';
import { TrendingUp, Scale, Heart, Target, Plus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Progress() {
  const { user } = useAuth();
  const progressLogs = user ? storage.getProgressLogs(user.id) : [];

  // Prepare data for charts
  const weightData = progressLogs.map(log => ({
    date: new Date(log.loggedAt).toLocaleDateString(),
    weight: log.weight || 0
  }));

  const stats = [
    {
      icon: Scale,
      label: 'Current Weight',
      value: `${progressLogs[0]?.weight || '--'} kg`,
      change: '+2.1 kg this month'
    },
    {
      icon: Heart,
      label: 'Body Fat',
      value: `${progressLogs[0]?.bodyFatPercentage || '--'}%`,
      change: '-1.2% this month'
    },
    {
      icon: Target,
      label: 'Goal Progress',
      value: '68%',
      change: '5% to goal'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Log Progress</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Weight Progress
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Measurements</h2>
          <div className="space-y-4">
            {progressLogs.slice(0, 5).map((log, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">
                    {new Date(log.loggedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold">{log.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Body Fat</p>
                    <p className="font-semibold">{log.bodyFatPercentage}%</p>
                  </div>
                </div>
                {log.notes && (
                  <p className="mt-2 text-sm text-gray-600">{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}