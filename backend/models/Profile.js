const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },  // E.g., 'Calories', 'Distance'
  target: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Goal', goalSchema);
