import { TYPES } from "../constants";

const initialState = {
  foodItems: null,
};

const addFoodReducer = (state = initialState, action) => {
  console.log("Action: ", action);
  switch (action.type) {
    case TYPES.ADD_FOOD_ITEMS:
      return {
        ...state,
        foodItems: action.payload,
      };
    case TYPES.EDIT_FOOD_ITEMS:
      const filteredMealItems = state.foodItems.filter(d => d.fdcId !== action.payload.fdcId);
      let updatedMealItem = state.foodItems.find(d => d.fdcId === action.payload.fdcId);
      updatedMealItem = { ...updatedMealItem, count: action.payload.count };

      let payload = {
        ...state,
        foodItems: [...filteredMealItems, updatedMealItem]
      };
      console.log("Edit Item Payload: ", payload);
      return payload;
    case TYPES.REMOVE_FOOD_ITEMS:
      return {
        ...state,
        foodItems: action.payload,
      };
    case TYPES.CLEAR_FOOD_CART:
      return {
        ...state,
        foodItems: null,
      };
    default:
      return state;
  }
};

export default addFoodReducer;