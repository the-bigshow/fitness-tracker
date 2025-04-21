require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());

// Connect to MongoDB
const connect = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
}

connect();

// Routes
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const goalRoutes = require('./routes/goalRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
