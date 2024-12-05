const express = require("express");
const router = express.Router();
const dataController = require("../controller/userCarbsDataController");

/**
 * @swagger
 * /api/submitData:
 *   post:
 *     summary: Store user meal data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               mealItems:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of meal items.
 *               totalCarbs:
 *                 type: number
 *                 description: Total carbohydrates consumed.
 *               mealType:
 *                 type: string
 *                 description: Type of meal (e.g., breakfast, lunch).
 *               insulinDose:
 *                 type: number
 *                 description: Insulin dose taken.
 *               bloodGlucoseBefore:
 *                 type: number
 *                 description: Blood glucose level before the meal.
 *               userICR:
 *                 type: number
 *                 description: User's Insulin-to-carbohydrate ratio.
 *               userCRR:
 *                 type: number
 *                 description: Correction factor ratio for the user.
 *     responses:
 *       '200':
 *         description: Successfully stored user meal data.
 *       default:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error saving user meal data.
 */
router.post("/submitData", dataController.storeUserData); // Use to Submit Data

/**
 * @swagger
 * /api/getDataByMealType/Date:
 *   get:
 *     summary: Get user meal data by meal type and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of meal (e.g., breakfast, lunch).
 *     responses:
 *       '200':
 *         description: Successfully fetched user meal data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The user meal data.
 *       '404':
 *         description: No user meal data found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getDataByMealType/Date", dataController.getDataByFoodType_Uid_Date);
// User clicks on BF which has already been submitted (Current Date)



/**
 * @swagger
 * /api/getFoodItemsByMealType:
 *   get:
 *     summary: Get user meal data by meal type and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of meal (e.g., breakfast, lunch).
 *     responses:
 *       '200':
 *         description: Successfully fetched user meal data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The user meal data.
 *       '404':
 *         description: No user meal data found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getFoodItemsByMealType", dataController.getFoodItemsByMealType); 




/**
 * @swagger
 * /api/getBloodGlucoseByUserIdAndMealType:
 *   get:
 *     summary: Get user meal data by meal type and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of meal (e.g., breakfast, lunch).
 *     responses:
 *       '200':
 *         description: Successfully fetched user meal data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The user meal data.
 *       '404':
 *         description: No user meal data found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getBloodGlucoseByUserIdAndMealType", dataController.getBloodGlucoseByUserIdAndMealType); 







/**
 * @swagger
 * /api/getUserData:
 *   get:
 *     summary: Get all meal data for a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successfully fetched user meal data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: The user meal data.
 *       '404':
 *         description: No user meal data found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getUserData", dataController.getAllUserData); // Get All Meal Data for the user

/**
 * @swagger
 * /api/getDataByDate:
 *   get:
 *     summary: Get user meal data by specific date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: query
 *         name: mealDate
 *         schema:
 *           type: string
 *         required: true
 *         description: The specific date (in the format DD/MM/YYYY) to get the meal data.
 *     responses:
 *       '200':
 *         description: Successfully fetched user meal data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: The user meal data.
 *       '404':
 *         description: No user meal data found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getDataByDate", dataController.getUserDataByDate); // Used in History Need to Give Specific Date(DD/MM/YYY) to Get Data

/**
 * @swagger
 * /api/userDates:
 *   get:
 *     summary: Get all dates for a user's meal
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successfully fetched user meal dates.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: The user meal dates.
 *       '404':
 *         description: No user meal dates found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/userDates", dataController.getUserAllDates);

/**
 * @swagger
 * /api/updateByIdAndFoodType:
 *   put:
 *     summary: Update user meal data by user ID, meal type, and current date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               mealType:
 *                 type: string
 *                 description: Type of meal (e.g., breakfast, lunch).
 *               mealItems:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of meal items.
 *               totalCarbs:
 *                 type: number
 *                 description: Total carbohydrates consumed.
 *     responses:
 *       '200':
 *         description: Successfully updated user meal data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The updated user meal data.
 *       '404':
 *         description: No user meal data found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No user meal found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.put("/updateByIdAndFoodType", dataController.updateByIdAndFoodType); // Update Current Day Meal

/**
 * @swagger
 * /api/addBloodGlucose:
 *   put:
 *     summary: Add blood glucose level to a user meal by meal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the user meal.
 *               bloodGlucoseLevel:
 *                 type: number
 *                 description: Blood glucose level after the meal.
 *     responses:
 *       '200':
 *         description: Successfully added blood glucose level to the user's meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The updated user meal data.
 *       '404':
 *         description: No user meal found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No user meal found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.put("/addBloodGlucose", dataController.addBloodGlucose); // Add BloodGlucose to Meals

/**
 * @swagger
 * /api/bloodGlucoseBefore:
 *   put:
 *     summary: Update blood glucose level before a meal by user ID and meal type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               mealType:
 *                 type: string
 *                 description: Type of meal (e.g., breakfast, lunch).
 *               bloodGlucoseBefore:
 *                 type: number
 *                 description: Blood glucose level before the meal.
 *     responses:
 *       '200':
 *         description: Successfully updated blood glucose level before the meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The updated user meal data.
 *       '404':
 *         description: No user meal found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No user meal found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.put("/bloodGlucoseBefore", dataController.bloodGlucoseBefore);





/**
 * @swagger
 * /api/addBloodGlucoseBeforeMeal:
 *   post:
 *     summary: Add blood glucose level before a meal by user ID, meal type, and current date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               mealType:
 *                 type: string
 *                 description: Type of meal (e.g., breakfast, lunch).
 *               bloodGlucoseBeforeMeal:
 *                 type: number
 *                 description: Blood glucose level before the meal.
 *     responses:
 *       '200':
 *         description: Successfully added blood glucose level before the meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The updated user meal data.
 *       '404':
 *         description: No user meal found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No user meal found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.post("/addBloodGlucoseBeforeMeal", dataController.addBloodGlucoseBeforeMeal);


/**
 * @swagger
 * /api/addBloodGlucoseAfterMeal:
 *   post:
 *     summary: Add blood glucose level before a meal by user ID, meal type, and current date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               mealType:
 *                 type: string
 *                 description: Type of meal (e.g., breakfast, lunch).
 *               bloodGlucoseAfterMeal:
 *                 type: number
 *                 description: Blood glucose level before the meal.
 *     responses:
 *       '200':
 *         description: Successfully added blood glucose level before the meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The updated user meal data.
 *       '404':
 *         description: No user meal found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No user meal found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.post("/addBloodGlucoseAfterMeal", dataController.addBloodGlucoseAfterMeal);



/**
 * @swagger
 * /api/getBloodGlucoseBeforeMeal:
 *   get:
 *     summary: Get blood glucose level before a meal by user ID, meal type, and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of meal (e.g., breakfast, lunch).
 *     responses:
 *       '200':
 *         description: Successfully fetched blood glucose level before the meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The blood glucose data.
 *       '404':
 *         description: No blood glucose data found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No blood glucose data found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getBloodGlucoseBeforeMeal", dataController.getBloodGlucoseBeforeMeal);







/**
 * @swagger
 * /api/getAllBloodGlucoseAfterMeal:
 *   get:
 *     summary: Get blood glucose level before a meal by user ID, meal type, and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successfully fetched blood glucose level before the meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The blood glucose data.
 *       '404':
 *         description: No blood glucose data found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No blood glucose data found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getAllBloodGlucoseAfterMeal", dataController.getAllBloodGlucoseAfterMeal);




/**
 * @swagger
 * /api/getBloodGlucoseBeforeMealByUserId:
 *   get:
 *     summary: Get blood glucose level before a meal by user ID, meal type, and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successfully fetched blood glucose level before the meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The blood glucose data.
 *       '404':
 *         description: No blood glucose data found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No blood glucose data found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getBloodGlucoseBeforeMealByUserId", dataController.getBloodGlucoseBeforeMealByUserId);



/**
 * @swagger
 * /api/getBloodGlucoseAfterMealByUserId:
 *   get:
 *     summary: Get blood glucose level before a meal by user ID, meal type, and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successfully fetched blood glucose level before the meal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The blood glucose data.
 *       '404':
 *         description: No blood glucose data found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No blood glucose data found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getBloodGlucoseAfterMealByUserId", dataController.getBloodGlucoseAfterMealByUserId);



/**
 * @swagger
 * /api/homeScreenCarbDetails:
 *   get:
 *     summary: Get carbohydrate details for the home screen by user ID and current date
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successfully fetched carbohydrate details for the home screen.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: The user meal data.
 *       '404':
 *         description: No carbohydrate details found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No carbohydrate details found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/homeScreenCarbDetails", dataController.getCarbDetailsHomeScreen); // Get Carbs Details for home screen

/**
 * @swagger
 * /api/updateUserICR:
 *   get:
 *     summary: Update user's Insulin to Carbohydrate Ratio (ICR)
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of meal (e.g., breakfast, lunch).
 *     responses:
 *       '200':
 *         description: Successfully updated user's ICR.
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               description: The new calculated ICR.
 *       default:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user's ICR.
 */
router.get("/updateUserICR", dataController.updateUserIcr);

/**
 * @swagger
 * /api/editMeal:
 *   post:
 *     summary: Edit meal details for a given meal type and user on the current date
 *     parameters:
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of meal (e.g., breakfast, lunch, dinner).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *               mealItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                 description: List of meal items with their quantities.
 *               totalCarbs:
 *                 type: number
 *                 description: Total carbohydrates in the meal.
 *               insulinDose:
 *                 type: number
 *                 description: Insulin dose administered.
 *               userCRR:
 *                 type: number
 *                 description: User's Carbohydrate Ratio.
 *               userICR:
 *                 type: number
 *                 description: User's Insulin to Carbohydrate Ratio.
 *     responses:
 *       '200':
 *         description: Successfully updated meal details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The updated meal details.
 *       '404':
 *         description: No user meal found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No user meal found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.post("/editMeal", dataController.editMeal);

/**
 * @swagger
 * /api/getAllBloodGlucoseBeforeMeal:
 *   get:
 *     summary: Get all blood glucose levels before meals
 *     responses:
 *       '200':
 *         description: Successfully fetched all blood glucose levels before meals.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: The blood glucose data for all meals.
 *       '404':
 *         description: No blood glucose data found for the given criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No blood glucose data found for the given criteria.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/getAllBloodGlucoseBeforeMeal", dataController.getAllBloodGlucoseBeforeMeal);

router.delete("/deleteMeal", dataController.deleteMeal);

module.exports = router;