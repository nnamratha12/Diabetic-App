const userMealSchema = require("../models/userFoodData");
const userMealDateSchema = require("../models/userMealDates");
const userBloodGlucoseSchema = require("../models/userBloodGlucose");
const { request } = require("http");

const storeUserData = async (req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  const {
    userId,
    mealItems = [], // Default to an empty array if not provided
    totalCarbs,
    mealType,
    insulinDose,
    bloodGlucoseBefore,
    userICR,
    userCRR,
  } = req.body;
 
  // const currentDate = new Date();
  const currentUTCDate = new Date();
  const mealDate = currentUTCDate.toLocaleDateString("en-US");

 


  
 
const estOptions = {
  timeZone: "America/New_York", // Still uses the America/New_York timezone
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23", // Use 24-hour clock
};
 
// Calculate the EST time ignoring DST
const forceESTOffset = -5 * 60; // Offset in minutes for UTC-5
const estDate = new Date(currentUTCDate.getTime() + forceESTOffset * 60 * 1000);
 
// Format manually to EST
const estDateTime = new Intl.DateTimeFormat("en-US", estOptions).format(estDate);
 
console.log("Current EST Date and Time:", estDateTime);
  // console.log("Current Time: ", formattedTime);


  if (mealItems.length === 0) {
    mealItems.push({
      description: "Manual Entry",
      dataType: "Manual Entry",
      foodNutrients: [],

      count: 1,
    });
  }


  const recordCount = await userMealSchema.countDocuments({
    userId,
    mealDate: mealDate,
  });

  console.log(`Existing record count for user ${userId} on ${mealDate}:`, recordCount);

  // Set mealType based on the incremented record number
  const newMealType = `Meal-${recordCount + 1}`;


  userMealDateSchema.findOne({
    userId,
    mealDate: mealDate,
  }).then(existingDate => {
    if (existingDate) {
      // If mealDate already exists, do not save a new entry
      console.log("MealDate already exists");
      return;
    }
    console.log("New Date: ");
    const newUserMealDateSchema = new userMealDateSchema({
      userId,
     
      mealDate,
      
    });
console.log("dateschema===>", newUserMealDateSchema);
    newUserMealDateSchema.save().then(dateSchema => {
      // Handle successful save
      console.log("New userMealDateSchema saved: ", dateSchema);
    });
  });

  const newUserMealSchema = new userMealSchema({
    userId,
    mealItems,
    totalCarbs,
    mealType : newMealType,
    mealDate,
    insulinDose,
    bloodGlucoseBefore,
    userICR,
    userCRR,
  });

  newUserMealSchema.save().then(mealSchema => {
    // Handle successful save
    console.log("New userMealSchema saved");
    res.status(200).send("New userMealSchema saved");
  });


 
};

// // Calculate new ICR based on historical data
function calculateNewICR(data) {
  const targetBloodGlucose = data[0].userICR;
  const correctionFactor = data[0].userCRR;

  // Calculate the average correction factor
  const sumCorrectionFactor = data.reduce((sum, entry) => {
    return (
      sum + (entry?.bloodGlucoseLevel- targetBloodGlucose) / entry.userCRR
    );
  }, 0);
  const averageCorrectionFactor = sumCorrectionFactor / data.length;

  // Calculate the new ICR rounded to one decimal place
  const initialICR = 10; // Replace with the user's initial ICR
  console.log("da corr: ", data[0].userICR, averageCorrectionFactor);
  return Number(
    (Number(data[0].userICR) * (1 + averageCorrectionFactor)).toFixed(1)
  );
}



const updateUserIcr = async (req, res) => {
  try {
    const { userId, mealType } = req.query;
    let newICR = 0;
   
    const options = {
      sort: { timestamp: -1 },
      limit: 7, // Limit the results to 7 entries
    };
   
    const updateICR = ["Meal"];
      updateICR.forEach(async element =>{
        console.log(element);
        const query = {
          userId: userId,
         // mealType: element,
        };
        const userBFData = await userMealSchema.find(query, null, options);
    console.log(userBFData);
    //  newICR = calculateNewICR(userBFData);
    // console.log("New ICr: ", newICR);
    if (userBFData && userBFData.length > 0) {
      const newICR = calculateNewICR(userBFData);
      console.log("New ICR: ", newICR);
  } else {
      console.log("No data found, skipping ICR calculation.");
  }
      });
    
    
    res.status(200).json(newICR);
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getDataByFoodType_Uid_Date = async (req, res) => {
  try {
    const { userId, mealType } = req.query;
    const currentDate = new Date().toLocaleDateString("en-US");
    console.log("Find Date: ", currentDate);
    const userMeal = await userMealSchema.find({
      userId,
     // mealType,
      mealDate: { $eq: currentDate },
    });

    if (userMeal) {
      res.status(200).json(userMeal);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error fetching user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getFoodItemsByMealType = async (req, res) => {
  try {
    const { userId, mealType } = req.query;
    const currentDate = new Date().toLocaleDateString("en-US");
    console.log("Find Date: ", currentDate);
    const userMeal = await userMealSchema.find({
      userId,
      mealType,
      mealDate: { $eq: currentDate },
    });

    if (userMeal) {
      res.status(200).json(userMeal);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error fetching user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserAllDates = async (req, res) => {
  try {
    
    const { userId } = req.query;
    console.log("user: ", userId);

    const userDates = await userMealDateSchema.aggregate([
      {
        $match: { userId }
      },
      
    ]);

    if (userDates.length > 0) {
      res.status(200).json(userDates);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error fetching user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserDataByDate = async (req, res) => {
  try {
    const { userId, mealDate } = req.query;
    
    const userMeal = await userMealSchema.find({
      userId,
      mealDate,
    });
    if (userMeal) {
      res.status(200).json(userMeal);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error fetching user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUserData = async (req, res) => {
  try {
    const { userId } = req.query;
    const userMeal = await userMealSchema.find({
      userId,
    });
    if (userMeal) {
      res.status(200).json(userMeal);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error fetching user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateByIdAndFoodType = async (req, res) => {
  try {
    const { userId, mealType, mealItems, totalCarbs } = req.body;

    const currentDate = new Date().toLocaleDateString("en-US");
    console.log("Find Date to Update: ", currentDate);

    const updatedUserMeal = await userMealSchema.findOneAndUpdate(
      { userId, mealType, mealDate: { $eq: currentDate } },
      {
        mealItems,
        totalCarbs,
      },
      { new: true }
    );

    if (updatedUserMeal) {
      res.status(200).json(updatedUserMeal);
    } else {
      res
        .status(404)
        .json({ message: "No user meal found for the given criteria" });
    }
  } catch (error) {
    console.error("Error updating user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// For adding blood glucose after meal
const addBloodGlucose = async (req, res) => {
  try {
    const { _id, bloodGlucoseLevel } = req.body;

    const updatedUserMeal = await userMealSchema.findOneAndUpdate(
      { _id },
      { bloodGlucoseLevel },
      { new: true }
    );

    if (updatedUserMeal) {
      res.status(200).json(updatedUserMeal);
    } else {
      res
        .status(404)
        .json({ message: "No user meal found for the given criteria" });
    }
  } catch (error) {
    console.error("Error updating user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const  addBloodGlucoseAfterMeal= async (req, res) => {
  try {
    const { userId, mealType, bloodGlucoseAfterMeal } = req.body;
    const currentDate = new Date().toLocaleDateString("en-US");
    console.log("current date===>", currentDate);
    console.log("Blood Glucose Level:", bloodGlucoseAfterMeal);
    const recordCount = await userBloodGlucoseSchema.countDocuments({
      userId,
      mealDate: currentDate,
      bloodGlucoseAfterMeal: { $ne: null },
    });

    console.log(`Existing record count for user ${userId} on ${currentDate}:`, recordCount);
    const newMealType = `Meal-${recordCount + 1}`;
    // Create a new record in the database
    const newUserMeal = await userBloodGlucoseSchema.create({
      userId,
      mealType:newMealType,
      mealDate: currentDate,
      bloodGlucoseAfterMeal,

    });

    res.status(201).json(newUserMeal); // 201 for created
  } catch (error) {
    console.error("Error adding user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




//not using this extra code
const bloodGlucoseBefore = async (req, res) => {
  try {
    const { userId, mealType, bloodGlucoseBefore } = req.body;

    const updatedUserMeal = await userBloodGlucose.findOneAndUpdate(
      { userId, mealType },
      { bloodGlucoseBefore },
      { new: true }
    );

    if (updatedUserMeal) {
      res.status(200).json(updatedUserMeal);
    } else {
      res
        .status(404)
        .json({ message: "No user meal found for the given criteria." });
    }
  } catch (error) {
    console.error("Error updating user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






const  addBloodGlucoseBeforeMeal= async (req, res) => {
  try {
    const { userId, mealType, bloodGlucoseBeforeMeal } = req.body;
    const currentDate = new Date().toLocaleDateString("en-US");
    console.log("current date===>", currentDate);
    console.log("Blood Glucose Level:", bloodGlucoseBeforeMeal);
    const recordCount = await userBloodGlucoseSchema.countDocuments({
      userId,
      mealDate: currentDate,
      bloodGlucoseBeforeMeal: { $ne: null },
    });

    console.log(`Existing record count for user ${userId} on ${currentDate}:`, recordCount);
    const newMealType = `Meal-${recordCount + 1}`;
    // Create a new record in the database
    const newUserMeal = await userBloodGlucoseSchema.create({
      userId,
      mealType:newMealType,
      mealDate: currentDate,
      bloodGlucoseBeforeMeal,

    });

    res.status(201).json(newUserMeal); // 201 for created
  } catch (error) {
    console.error("Error adding user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};







const getBloodGlucoseBeforeMeal = async (req, res) => {
  try {
    const { userId, mealType, mealDate } = req.query;

    const userBloodGlucose = await userBloodGlucoseSchema.findOne({
      userId,
      mealType,
      mealDate: { $eq: mealDate },
    });

    if (userBloodGlucose) {
      res.status(200).json(userBloodGlucose);
    } else {
      res.status(404).json({ message: "No blood glucose data found for the given criteria." });
    }
  } catch (error) {
    console.error("Error fetching blood glucose data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



const getAllBloodGlucoseAfterMeal = async (req, res) => {
  try {
    const { userId, mealType, mealDate } = req.query;

    const userBloodGlucose = await userBloodGlucoseSchema.find({
      userId,
      bloodGlucoseAfterMeal: { $ne: null },
    });

    if (userBloodGlucose) {
      res.status(200).json(userBloodGlucose);
    } else {
      res.status(404).json({ message: "No blood glucose data found for the given criteria." });
    }
  } catch (error) {
    console.error("Error fetching blood glucose data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


const getBloodGlucoseBeforeMealByUserId = async (req, res) => {
  try {
    console.log("req===>",req);
    const { userId } = req.query;
    const currentDate = new Date().toLocaleDateString("en-US");

    const userBloodGlucose = await userBloodGlucoseSchema.find({
      userId,
      mealDate: currentDate,
      bloodGlucoseBeforeMeal: { $ne: null },
    });


    if (userBloodGlucose) {
      res.status(200).json(userBloodGlucose);
    } else {
      res.status(404).json({ message: "No blood glucose data found for the given criteria." });
    }
  } catch (error) {
    console.error("Error fetching blood glucose data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


const getBloodGlucoseAfterMealByUserId = async (req, res) => {
  try {
    console.log("req===>",req);
    const { userId } = req.query;
    const currentDate = new Date().toLocaleDateString("en-US");
console.log("Currentdate===>",currentDate,userId);
    const userBloodGlucose = await userBloodGlucoseSchema.find({
      userId,
      mealDate: currentDate,
      bloodGlucoseAfterMeal: { $ne: null },
    });


    if (userBloodGlucose) {
      res.status(200).json(userBloodGlucose);
    } else {
      res.status(404).json({ message: "No blood glucose data found for the given criteria." });
    }
  } catch (error) {
    console.error("Error fetching blood glucose data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



const getBloodGlucoseByUserIdAndMealType = async (req, res) => {
  try {
    console.log("req===>",req);
    const { userId, mealType} = req.query;
    const currentDate = new Date().toLocaleDateString("en-US");
console.log("Currentdate===>",currentDate,userId);
    const userBloodGlucose = await userBloodGlucoseSchema.find({
      userId,
      mealDate: currentDate,
      bloodGlucoseAfterMeal: { $ne: null },
      mealType,
    });


    if (userBloodGlucose) {
      res.status(200).json(userBloodGlucose);
    } else {
      res.status(404).json({ message: "No blood glucose data found for the given criteria." });
    }
  } catch (error) {
    console.error("Error fetching blood glucose data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}




const getAllBloodGlucoseBeforeMeal = async (req, res) => {
  try {
    const { userId, mealDate } = req.query;

    const userBloodGlucose = await userBloodGlucoseSchema.find({
      userId,
      mealDate: { $eq: mealDate },
      bloodGlucoseBeforeMeal: { $ne: null },
    });

    if (userBloodGlucose) {
      res.status(200).json(userBloodGlucose);
    } else {
      res.status(404).json({ message: "No blood glucose data found for the given criteria." });
    }
  } catch (error) {
    console.error("Error fetching blood glucose data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getCarbDetailsHomeScreen = async (req, res) => {
  try {
    const { userId } = req.query;
    const currentDate = new Date().toLocaleDateString("en-US");
    const userMeal = await userMealSchema.find({
      userId,
      mealDate: { $eq: currentDate },
    });
    if (userMeal) {
      res.status(200).json(userMeal);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error fetching user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editMeal = async (req, res) => {
  try {
    const { mealType } = req.query;
    const {
      userId,
      mealItems,
      totalCarbs,
      insulinDose,
      userCRR,
      userICR,
    } = req.body;
    const currentDate = new Date().toLocaleDateString("en-US");
    
    const updatedUserMeal = await userMealSchema.findOneAndUpdate(
      {
        userId,
        mealType,
        mealDate: { $eq: currentDate },
      },
      {
        mealItems,
        totalCarbs,
        insulinDose,
        userCRR,
        userICR,
      },
      { new: true }
    );

    if (updatedUserMeal) {
      res.status(200).json(updatedUserMeal);
    } else {
      res
        .status(404)
        .json({ message: "No user meal found for the given criteria." });
    }
  } catch (error) {
    console.error("Error updating user meal: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteMeal = async (req, res) => {
  try {
    const {userICR, mealType, userId}=req.query;
    const result = await userMealSchema.deleteMany({
      userICR: userICR,
      mealType: mealType,
      userId: userId,
      mealDate: new Date().toLocaleDateString("en-US")  // Ensure that mealdate is a valid date or correctly formatted
    });

    if (result.deletedCount > 0) {
      res.status(200).send(`${result.deletedCount} records deleted successfully.`);
    } else {
      res.status(404).send('No records found to delete.');
    }
  } catch (error) {
    console.error('Error deleting records:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  storeUserData,
  getDataByFoodType_Uid_Date,
  getUserDataByDate,
  getAllUserData,
  getUserAllDates,
  updateByIdAndFoodType,
  getCarbDetailsHomeScreen,
  updateUserIcr,
  addBloodGlucose,
  bloodGlucoseBefore,
  addBloodGlucoseBeforeMeal,
  getBloodGlucoseBeforeMeal,
  getBloodGlucoseBeforeMealByUserId,
  getAllBloodGlucoseBeforeMeal,
  editMeal,
  deleteMeal,
  addBloodGlucoseAfterMeal,
  getBloodGlucoseAfterMealByUserId,
  getFoodItemsByMealType,
  getBloodGlucoseByUserIdAndMealType,
  getAllBloodGlucoseAfterMeal,
};