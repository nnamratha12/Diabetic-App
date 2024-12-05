const mongoose = require("mongoose");

const userMealSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userICR: {
    type: String,
    required: true,
    default: 10,
  },
  userCRR: {
    type: String,
    default: 50,
    required: true,
  },
  mealType: {
    type: String,
  
    required: true,
  },
  mealItems: {
    type: Array,
    required: false,  // Set to false to make it optional
    default: [],      // Default to an empty array if not provided
  },

  totalCarbs: {
    type: Number,
    required: true,
  },
  consumedAt: {
    type: Date,
    default: Date.now,
  },
  mealDate: {
    type: String,
    default: new Date().toLocaleDateString("en-US"),
  },
  insulinDose: {
    type: Number,
    required: true,
  },
  bloodGlucoseLevel: {
    type: Number,
  },
  bloodGlucoseLevelBeforeMeal: {
    type: Number,
  },
  bloodGlucoseBefore: {
    type: Number,
  }
});

userMeal = mongoose.model("userMeal", userMealSchema);

module.exports = userMeal;
