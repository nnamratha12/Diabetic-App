import axios from "axios";
import { API_KEY } from "@env";
import {
  clearFoodSearch,
  fetchFoodItem,
  fetchFoodItemFailure,
  fetchFoodItemSuccess,
  fetchFoodSearch,
  fetchFoodSearchFailure,
  fetchFoodSearchSuccess,
  clearFoodItem
} from "./actionTypes";
import { cleanSearchData } from "../../utils/cleanSearchData";

const apiUrl_foodSearch = "https://api.nal.usda.gov/fdc/v1/foods/search";
const apiUrl_getFoodById = "https://api.nal.usda.gov/fdc/v1/food/";

export const fetchFoodSearchAPI = params => {
  let config = { params: { ...params, api_key: API_KEY } };
  return async dispatch => {
    dispatch(fetchFoodSearch());
    try {
      const response = await axios.get(apiUrl_foodSearch, config);
      const updatedData = cleanSearchData(response.data);
      dispatch(fetchFoodSearchSuccess(updatedData));
    } catch (error) {
      dispatch(fetchFoodSearchFailure(error.message));
    }
  };
};

export const clearFoodSearchResults = () => dispatch => dispatch(clearFoodSearch());

export const fetchFoodItemByIdAPI = (params, fdcId, tag) => {
  let config = { params: { ...params, api_key: API_KEY } };
  return async dispatch => {
    dispatch(fetchFoodItem());
    try {
      const response = await axios.get(`${apiUrl_getFoodById}${fdcId}`, config);
      dispatch(fetchFoodItemSuccess(response.data));
    } catch (error) {
      dispatch(fetchFoodItemFailure(response.data));
    }
  };
};

export const clearFoodItemResults = () => dispatch => dispatch(clearFoodItem());
