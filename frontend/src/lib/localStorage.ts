// User types
export interface User {
  id: string;
  email: string;
  profile?: UserProfile;
}

export interface UserProfile {
  username?: string;
  fullName?: string;
  height?: number;
  weight?: number;
  goal?: string;
  profilePhoto?: string;
}

// Health metrics types
export interface HealthMetrics {
  id: string;
  userId: string;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  oxygenLevel: number;
  steps: number;
  waterIntake: number;
  date: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Workout types
export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  dayOfWeek: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
  orderPosition: number;
}

// Diet tracking types
export interface DietLog {
  id: string;
  userId: string;
  foodName: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  mealType?: string;
  loggedAt: string;
}

// Progress tracking types
export interface ProgressLog {
  id: string;
  userId: string;
  weight?: number;
  bodyFatPercentage?: number;
  measurements?: Record<string, number>;
  notes?: string;
  loggedAt: string;
}

// Todo types
export interface Todo {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

// Storage keys
const STORAGE_KEYS = {
  WORKOUT_PLANS: 'fitness_tracker_workout_plans',
  DIET_LOGS: 'fitness_tracker_diet_logs',
  PROGRESS_LOGS: 'fitness_tracker_progress_logs',
  TODOS: 'fitness_tracker_todos',
  USER_PROFILES: 'fitness_tracker_user_profiles',
  HEALTH_METRICS: 'fitness_tracker_health_metrics',
  CHAT_MESSAGES: 'fitness_tracker_chat_messages',
} as const;

// Generic storage functions
function getStorageItem<T>(key: string): T[] {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
}

function setStorageItem<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Storage API
export const storage = {
  // Health Metrics
  getHealthMetrics: (userId: string): HealthMetrics[] => {
    return getStorageItem<HealthMetrics>(STORAGE_KEYS.HEALTH_METRICS)
      .filter(metric => metric.userId === userId);
  },

  saveHealthMetrics: (metrics: HealthMetrics): void => {
    const allMetrics = getStorageItem<HealthMetrics>(STORAGE_KEYS.HEALTH_METRICS);
    const index = allMetrics.findIndex(m => m.id === metrics.id);
    
    if (index >= 0) {
      allMetrics[index] = metrics;
    } else {
      allMetrics.push(metrics);
    }
    
    setStorageItem(STORAGE_KEYS.HEALTH_METRICS, allMetrics);
  },

  // Chat Messages
  getChatMessages: (userId: string): ChatMessage[] => {
    return getStorageItem<ChatMessage>(STORAGE_KEYS.CHAT_MESSAGES)
      .filter(msg => msg.senderId === userId || msg.receiverId === userId);
  },

  saveChatMessage: (message: ChatMessage): void => {
    const messages = getStorageItem<ChatMessage>(STORAGE_KEYS.CHAT_MESSAGES);
    messages.push(message);
    setStorageItem(STORAGE_KEYS.CHAT_MESSAGES, messages);
  },

  // Existing methods
  getWorkoutPlans: (userId: string): WorkoutPlan[] => {
    return getStorageItem<WorkoutPlan>(STORAGE_KEYS.WORKOUT_PLANS)
      .filter(plan => plan.userId === userId);
  },
  
  saveWorkoutPlan: (plan: WorkoutPlan): void => {
    const plans = getStorageItem<WorkoutPlan>(STORAGE_KEYS.WORKOUT_PLANS);
    const index = plans.findIndex(p => p.id === plan.id);
    
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }
    
    setStorageItem(STORAGE_KEYS.WORKOUT_PLANS, plans);
  },

  getDietLogs: (userId: string): DietLog[] => {
    return getStorageItem<DietLog>(STORAGE_KEYS.DIET_LOGS)
      .filter(log => log.userId === userId);
  },

  saveDietLog: (log: DietLog): void => {
    const logs = getStorageItem<DietLog>(STORAGE_KEYS.DIET_LOGS);
    logs.push(log);
    setStorageItem(STORAGE_KEYS.DIET_LOGS, logs);
  },

  getProgressLogs: (userId: string): ProgressLog[] => {
    return getStorageItem<ProgressLog>(STORAGE_KEYS.PROGRESS_LOGS)
      .filter(log => log.userId === userId);
  },

  saveProgressLog: (log: ProgressLog): void => {
    const logs = getStorageItem<ProgressLog>(STORAGE_KEYS.PROGRESS_LOGS);
    logs.push(log);
    setStorageItem(STORAGE_KEYS.PROGRESS_LOGS, logs);
  },

  getTodos: (userId: string): Todo[] => {
    return getStorageItem<Todo>(STORAGE_KEYS.TODOS)
      .filter(todo => todo.userId === userId);
  },

  saveTodo: (todo: Todo): void => {
    const todos = getStorageItem<Todo>(STORAGE_KEYS.TODOS);
    const index = todos.findIndex(t => t.id === todo.id);
    
    if (index >= 0) {
      todos[index] = todo;
    } else {
      todos.push(todo);
    }
    
    setStorageItem(STORAGE_KEYS.TODOS, todos);
  },

  getUserProfile: (userId: string): UserProfile | undefined => {
    const profiles = getStorageItem<User>(STORAGE_KEYS.USER_PROFILES);
    return profiles.find(p => p.id === userId)?.profile;
  },

  saveUserProfile: (userId: string, profile: UserProfile): void => {
    const profiles = getStorageItem<User>(STORAGE_KEYS.USER_PROFILES);
    const index = profiles.findIndex(p => p.id === userId);
    
    if (index >= 0) {
      profiles[index].profile = profile;
    } else {
      profiles.push({ id: userId, email: '', profile });
    }
    
    setStorageItem(STORAGE_KEYS.USER_PROFILES, profiles);
  },

  // Get all users for chat functionality
  getAllUsers: (): User[] => {
    return getStorageItem<User>(STORAGE_KEYS.USER_PROFILES);
  }
};