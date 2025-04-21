const Goal = require('../models/Goal'); // Assuming you have a Goal model defined
const User = require('../models/User'); // Assuming you have a User model defined

// Create a new fitness goal for a user
exports.createGoal = async (req, res) => {
  const { userId, targetCalories, targetSteps, targetMinutes } = req.body;
  
  try {
    // Find the user by ID to associate the goal with the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the goal
    const goal = new Goal({
      user: userId,
      targetCalories,
      targetSteps,
      targetMinutes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // Save the goal to the database
    await goal.save();

    // Update the user's goal reference (if needed)
    user.goals.push(goal._id);
    await user.save();

    res.status(201).json({ message: "Goal created successfully", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user and populate their goals
    const user = await User.findById(userId).populate('goals');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ goals: user.goals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user's goal
exports.updateGoal = async (req, res) => {
  const { goalId } = req.params;
  const { targetCalories, targetSteps, targetMinutes } = req.body;

  try {
    // Find and update the goal
    const goal = await Goal.findByIdAndUpdate(
      goalId,
      { targetCalories, targetSteps, targetMinutes, updatedAt: Date.now() },
      { new: true } // Return the updated goal
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal updated successfully", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user's goal
exports.deleteGoal = async (req, res) => {
  const { goalId } = req.params;

  try {
    // Delete the goal from the database
    const goal = await Goal.findByIdAndDelete(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Optionally, remove the goal reference from the user's goals array
    const user = await User.findById(goal.user);
    user.goals = user.goals.filter(id => id.toString() !== goalId);
    await user.save();

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
