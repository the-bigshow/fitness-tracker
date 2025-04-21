const Workout = require('../models/Workout'); 
const User = require('../models/User'); 

exports.createWorkout = async (req, res) => {
  const { userId, workoutType, duration, caloriesBurned, date } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workout = new Workout({
      user: userId,
      workoutType,
      duration,
      caloriesBurned,
      date,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await workout.save();

    user.workouts.push(workout._id);
    await user.save();

    res.status(201).json({ message: "Workout created successfully", workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkouts = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('workouts');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ workouts: user.workouts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkoutById = async (req, res) => {
  const { workoutId } = req.params;

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const { workoutType, duration, caloriesBurned, date } = req.body;

  try {
    
    const workout = await Workout.findByIdAndUpdate(
      workoutId,
      { workoutType, duration, caloriesBurned, date, updatedAt: Date.now() },
      { new: true } 
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout updated successfully", workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteWorkout = async (req, res) => {
  const { workoutId } = req.params;

  try {
    
    const workout = await Workout.findByIdAndDelete(workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    const user = await User.findById(workout.user);
    user.workouts = user.workouts.filter(id => id.toString() !== workoutId);
    await user.save();

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
