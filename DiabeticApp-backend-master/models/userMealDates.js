const mongoose = require("mongoose");

const userMealDateSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mealDate: {
    type: String,
    default: () => new Date().toLocaleString("en-US", { timeZone: "America/New_York" }
)},
});

userMealDate = mongoose.model("userMealDate", userMealDateSchema);

module.exports = userMealDate;
