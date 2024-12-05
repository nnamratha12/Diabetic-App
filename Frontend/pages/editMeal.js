
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import {
  Text,
  Button,
  List,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { calculateCarbs, getInsulinDose } from "../utils/nutritionCalculation";
import { RemoveFoodItem, AddFoodItem, ClearFoodCart } from "../redux/actions/actionTypes";
import { useFocusEffect } from '@react-navigation/native';
import { fetchFoodItemByIdAPI } from "../redux/actions/actions";
import axios from "axios";
import { BASE_URL } from "@env";

const EditMeal = ({ navigation, route }) => {
  const { tag } = route?.params;
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const addFood = useSelector(state => state.addFood);
  console.log('User: ', user);
  console.log("User ID: ", user?.userProfInfo?.userProfData);

  useEffect(() => {
    const fetchMealItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/getDataByMealType/Date?userId=${user?.user?.uid}&mealType=${tag}`);
        console.log("Response: ", response);
        dispatch(AddFoodItem(response.data.mealItems));
      } catch (error) {
        console.error("Failed to fetch meal items: ", error);
      }
    };
    console.log("addFood?.foodItems: ", addFood);
    if (!addFood?.foodItems)
      fetchMealItems();
  }, [tag, user?.user?.uid]);

  let icr;
  const totalCarbs =
    addFood?.foodItems?.length > 0 ? calculateCarbs(addFood?.foodItems) : 0;
  if (tag === "Breakfast") {
    icr = user?.userProfInfo?.userProfData.bfICR;
  } else if (tag === "Lunch") {
    icr = user?.userProfInfo?.userProfData.lhICR;
  } else {
    icr = user?.userProfInfo?.userProfData.mICR;
  }
  const insulinDose = getInsulinDose(totalCarbs, icr);

  const onSave = async () => {
    let userICR;

    if (tag === "Breakfast") {
      userICR = user?.userProfInfo?.userProfData.bfICR;
    } else if (tag === "Lunch") {
      userICR = user?.userProfInfo?.userProfData.lhICR;
    } else {
      userICR = user?.userProfInfo?.userProfData.mICR;
    }
    console.log("icc: ", userICR);
    console.log("user: ", user);
    let params = {
      userId: user?.user?.uid,
      mealItems: addFood?.foodItems,
      totalCarbs: totalCarbs,
      mealType: tag,
      insulinDose: insulinDose,
      userCRR: user?.userProfInfo?.userProfData.crr,
      userICR: userICR,
    };
    console.log("params: ", params);
    await axios.post(`${BASE_URL}/api/editMeal?mealType=${tag}`, params)
      .then(() => {
        console.log("Data submitted successfully.");
        navigation.navigate("HomeScreen");
      }).catch(e => console.log("Error: ", e));
    dispatch(ClearFoodCart());
  };
 

  const onDelete = async () => {
    let userICR;

    if (tag === "Breakfast") {
      userICR = user?.userProfInfo?.userProfData.bfICR;
    } else if (tag === "Lunch") {
      userICR = user?.userProfInfo?.userProfData.lhICR;
    } else {
      userICR = user?.userProfInfo?.userProfData.mICR;
    }
    console.log("icc: ", userICR);
    console.log("user: ", user);
    userId= user?.user?.uid;
    
    await axios.delete(`${BASE_URL}/api/deleteMeal?mealType=${tag}&userId=${userId}&userICR=${userICR}`)
      .then(() => {
        console.log("Data submitted successfully.");
        navigation.navigate("HomeScreen");
      }).catch(e => console.log("Error: ", e));
    dispatch(ClearFoodCart());

  };



  const getCarbs = item => {
    let carbs;
    carbs = item.foodNutrients.find(y => parseInt(y.number) === 205);
    return carbs ? carbs.amount : 0;
  };
  const handleEditItem = item => {
    // Handle edit action here
    const params = {
      format: "abridged",
      nutrients: "208,204,205,262,203,291,301,302,303,304,305,306,307,601,",
    };

    dispatch(fetchFoodItemByIdAPI(params, item?.fdcId, tag));
    navigation.navigate("EditFood", { item });
  };

  const handleDeleteItem = fdcId => {
    // Handle delete action here
    const updatedArray = addFood?.foodItems?.filter(item => item.fdcId !== fdcId);
    dispatch(RemoveFoodItem(updatedArray));
  };

  const EmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.message}>Your cart is empty!</Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go Back
      </Button>
      <Button onPress={onDelete} mode="contained" style={styles.saveButton}>
        Save
      </Button>
    </View>
  );

  const RightListView = ({ item }) => (
    <View>
      <Text>Quantity: {item?.count}</Text>
    </View>
  );

  const Content = () => {
    console.log("Food Items for Content Component: ", addFood?.foodItems);
    return (
      <>
        <List.Section style={styles.listSection}>
          <List.Subheader>
            {" "}
            <Text style={styles.message}>My Food Cart</Text>
          </List.Subheader>
          {addFood?.foodItems?.map((item, index) => (
            <View key={item.fdcId} style={{ flexDirection: "row" }}>
              <List.Item
                style={{ flex: 1 }}
                key={index}
                title={item.description}
                description={`Carbs : ${getCarbs(item)}`}
                right={() => <RightListView item={item} />}
              />
              <Tooltip title="Edit" leaveTouchDelay={1000}>
                <IconButton
                  icon="pencil"
                  onPress={() => handleEditItem(item)}
                  iconColor={theme.colors.primary}
                />
              </Tooltip>
              <Tooltip title="Delete" leaveTouchDelay={1000}>
                <IconButton
                  icon="delete"
                  onPress={() => handleDeleteItem(item.fdcId)}
                  iconColor={theme.colors.error}
                />
              </Tooltip>
            </View>
          ))}
        </List.Section>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("FoodSearch", { tag, fromEditMeal: true })}
          style={styles.addButton}
        >
          Add Food
        </Button>
        <Divider />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total Carbs: {totalCarbs ? totalCarbs?.toFixed(2) : 0} g
          </Text>
          <Text style={styles.totalText}>
            Your Insulin Dose: {insulinDose ? insulinDose : 0} units
          </Text>
          <Button onPress={onSave} mode="contained" style={styles.saveButton}>
            Save
          </Button>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {addFood?.foodItems?.length > 0 ? <Content /> : <EmptyCart />}
    </View>
  );
};

export default EditMeal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  emptyCartContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  message: {
    fontSize: 24,
    marginBottom: 16,
    color: '#333',
    // fontFamily: 'Montserrat-Bold',
  },
  button: {
    marginTop: 16,
    width: "50%",
    backgroundColor: '#6200ea',
  },
  listSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    paddingVertical: 4,
    color: '#333',
    // fontFamily: 'Montserrat-Medium',
  },
  saveButton: {
    marginTop: 15,
    marginHorizontal: 16,
    backgroundColor: '#2346AD',
  },
  addButton: {
    marginBottom: 15,
    marginHorizontal: 16,
    backgroundColor: '#2346AD',
    width: '25%',
    alignSelf: 'center',
  },
});
