const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },  // E.g., 'Running', 'Cycling'
  duration: { type: Number, required: true }, // In minutes
  caloriesBurned: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workout', workoutSchema);
