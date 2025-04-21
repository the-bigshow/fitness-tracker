import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, TrendingUp, Apple, CheckSquare, Plus, Calendar, X, Heart, Droplets, Activity as ActivityIcon, Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage, HealthMetrics } from '../lib/localStorage';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    id: crypto.randomUUID(),
    userId: user?.id || '',
    heartRate: 75,
    bloodPressure: {
      systolic: 120,
      diastolic: 80
    },
    oxygenLevel: 98,
    steps: 0,
    waterIntake: 0,
    date: new Date().toISOString()
  });

  useEffect(() => {
    if (user) {
      const userTodos = storage.getTodos(user.id);
      setTodos(userTodos);

      const todayMetrics = storage.getHealthMetrics(user.id)
        .find(m => new Date(m.date).toDateString() === new Date().toDateString());
      
      if (todayMetrics) {
        setHealthMetrics(todayMetrics);
      }
    }
  }, [user]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: newTodo,
      completed: false,
      dueDate: newTodoDueDate || undefined
    };

    storage.saveTodo(todo);
    setTodos([...todos, todo]);
    setNewTodo('');
    setNewTodoDueDate('');
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    const todoToUpdate = updatedTodos.find(t => t.id === id);
    if (todoToUpdate && user) {
      storage.saveTodo(todoToUpdate);
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateHealthMetric = (key: keyof HealthMetrics, value: any) => {
    const updatedMetrics = { ...healthMetrics, [key]: value };
    setHealthMetrics(updatedMetrics);
    if (user) {
      storage.saveHealthMetrics(updatedMetrics);
    }
  };

  const addWater = () => {
    updateHealthMetric('waterIntake', healthMetrics.waterIntake + 250); // Add 250ml
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>
      
      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Heart Rate</p>
              <h2 className="text-2xl font-bold">{healthMetrics.heartRate} BPM</h2>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Blood Pressure</p>
              <h2 className="text-2xl font-bold">
                {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}
              </h2>
            </div>
            <ActivityIcon className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Oxygen Level</p>
              <h2 className="text-2xl font-bold">{healthMetrics.oxygenLevel}%</h2>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Steps Today</p>
              <h2 className="text-2xl font-bold">{healthMetrics.steps}</h2>
            </div>
            <Footprints className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <Droplets className="h-6 w-6 text-blue-500 mr-2" />
              Water Intake
            </h2>
            <p className="text-gray-500">{healthMetrics.waterIntake}ml / 2000ml</p>
          </div>
          <button
            onClick={addWater}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add 250ml
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${Math.min((healthMetrics.waterIntake / 2000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/workout-plans" className="block">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Activity className="h-8 w-8 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Workout Plans</h2>
            <p className="text-gray-600">View and manage your workout routines</p>
          </div>
        </Link>

        <Link to="/diet-tracking" className="block">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Apple className="h-8 w-8 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Diet Tracking</h2>
            <p className="text-gray-600">Log and monitor your nutrition</p>
          </div>
        </Link>

        <Link to="/progress" className="block">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Progress</h2>
            <p className="text-gray-600">Track your fitness journey</p>
          </div>
        </Link>
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <CheckSquare className="h-6 w-6 text-purple-600 mr-2" />
            Today's Tasks
          </h2>
          <span className="text-sm text-gray-500">
            {todos.filter(todo => todo.completed).length}/{todos.length} completed
          </span>
        </div>

        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              } border border-gray-200`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {todo.title}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {todo.dueDate && (
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}