import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  IconButton,
  Portal,
  Dialog,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { clearFoodItemResults } from "../redux/actions/actions";
import * as actionTypes from "../redux/actions/actionTypes";
import AddCarbsModal from "../ui/addCarbsModal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { all } from "axios";


const AddFood = ({ navigation, route }) => {
  const { tag, fromEditMeal, isDelete } = route?.params;
  console.log("Delete food item? ", isDelete);
  const dispatch = useDispatch();
  const foodItem = useSelector(state => state.api);
  const addFoodItem = useSelector(state => state.addFood);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodDetails, setFoodDetails] = useState(null);
  const [servingCount, setServingCount] = useState(1);
  const [carbs, setCarbs] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [carbUnit, setCarbUnit] = useState("");

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);

  const hideDialog = () => setDialogVisible(false);

  const showSnackBar = () => setIsSnackbarVisible(true);

  const onDismissSnackBar = () => setIsSnackbarVisible(false);

  useEffect(() => {
    console.log("Food Item: ", foodItem);
    if (foodItem) {
      setFoodDetails(foodItem.foodItem);
      dispatch(clearFoodItemResults());
      let carbs = foodItem.foodItem?.foodNutrients?.find(x => parseInt(x.number) === 205);
      setCarbs(carbs?.amount?.toFixed(2));
      setTotalCarbs(carbs?.amount?.toFixed(2));
      setCarbUnit(carbs.unitName);
    }
  }, []);

  // Function to handle incrementing the serving count
  const incrementServingCount = () => {
    setTotalCarbs((carbs * (servingCount + 1))?.toFixed(2));
    setServingCount(servingCount + 1.0);
  };

  // Function to handle decrementing the serving count
  const decrementServingCount = () => {
    if (servingCount > 1) {
      setTotalCarbs((carbs * (servingCount - 1))?.toFixed(2));
      setServingCount(servingCount - 1.0);
    }
  };

  const addFood = (item, count) => {
    let allItems = addFoodItem.foodItems ? addFoodItem.foodItems : [];
    let check = allItems?.find(x => x.fdcId === item.fdcId);
    if (check){
      allItems = allItems?.filter(x => x.fdcId !== item.fdcId);
      check = false;
    }
       if (!check  ) {
   
      console.log("check==>", count);
      let params = [
        ...allItems,
        {
          ...item,
          count: count,
        },
      ];
      showSnackBar();
      setTimeout(() => {
        dispatch(actionTypes.AddFoodItem(params));
        if (fromEditMeal) {
          navigation.navigate("EditMeal", { tag: tag });
        } else {
          navigation.navigate("FoodCart", { tag: tag });
        }
      }, 1000);
    }  
    
   else {
    
      if (isDelete) {
        allItems = allItems?.filter(x => x.fdcId !== item.fdcId);
        let params = [
          ...allItems,
          {
            ...item,
            count: count,
          },
        ];
        showSnackBar();
        setTimeout(() => {
          dispatch(actionTypes.AddFoodItem(params));
          if (fromEditMeal) {
            navigation.navigate("EditMeal", { tag: tag });
          } else {
            navigation.navigate("FoodCart", { tag: tag });
          }
        }, 1000);
      } 
      else {
        console.log("in else stmt");
        showDialog();
      }
    }
  };

  const handleSaveCarbs = carbs => {
    setModalVisible(false);
    let currentData = foodDetails?.foodNutrients?.find(x => parseInt(x.number) === 205);
    let newData = { ...currentData, amount: Number(carbs) };
    let newArray = foodDetails?.foodNutrients.map(item => parseInt(item.number) === 205 ? newData : item);
    let newFoodDetails = { ...foodDetails, foodNutrients: newArray };
    addFood(newFoodDetails, 1);
  };

  const RenderPortal = () => (
    <Portal>
      <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
        <Dialog.Title>Uhhhmm...</Dialog.Title>
        <Dialog.Content>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="alert-circle-outline"
              size={24}
              iconColor="red"
            />
            <Text style={{ marginLeft: 8 }}>
              You have already added this item.
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const RenderSuccessMessage = () => (
    <Snackbar
      visible={isSnackbarVisible}
      onDismiss={onDismissSnackBar}
      duration={1000}
    >
      Item added to Cart!
    </Snackbar>
  );

  const handleChange = count => setServingCount(count);

  return (
    <ImageBackground
    source={{ uri: 'https://img.freepik.com/free-photo/loaf-bread-with-color-background_23-2148154392.jpg?semt=ais_hybrid' }} // Test URL
    style={styles.backgroundImage}
  >
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
      <ImageBackground
    source={{ uri: 'https://img.freepik.com/free-photo/loaf-bread-with-color-background_23-2148154392.jpg?semt=ais_hybrid' }} // Test URL
    style={styles.backgroundImage}
  >
        {foodDetails?.fdcId ? (
          <Card style={styles.card}>
            <Card.Content>
              
              <Title>{foodDetails.description}</Title>
              {foodDetails?.foodNutrients?.map(item => {
                return (
                  <View key={item?.number}>
                    <Paragraph>
                      {item.name} : {item.amount}
                      {item.unitName}
                    </Paragraph>
                  
                  </View>
                );
              })}
              <View style={styles.servingContainer}>
              
  
                <Text variant="titleMedium">Number of Servings (100g/serving): </Text>
                <IconButton
                  icon="minus-circle-outline"
                  size={30}
                  onPress={decrementServingCount}
                />
                <TextInput
                  style={styles.servingCount}
                  value={servingCount}
                  keyboardType="numeric"
                  onChangeText={handleChange}
                />
                <IconButton
                  icon="plus-circle-outline"
                  size={30}
                  onPress={incrementServingCount}
                />
                
              </View>
              <View style={styles.servingContainer}>
                <Text variant="titleMedium">Total Carbs: </Text>
                <Text style={styles.servingText}>
                  {totalCarbs} {carbUnit}
                </Text>
              </View>
              <Button onPress={() => setModalVisible(true)}>
                Add Carbs Manually?
              </Button>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => addFood(foodDetails, servingCount)}
              >
                Add To Cart
              </Button>
            </Card.Actions>
          </Card>
        ) : null}
        <AddCarbsModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSave={handleSaveCarbs}
        />
        <RenderPortal />
        <RenderSuccessMessage />
        </ImageBackground>
      </View>
    </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default AddFood;

const styles = StyleSheet.create({

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
   
  },
  card: {
    marginBottom: 16,
  },
  actions: {
    marginTop: 8,
    justifyContent: "space-between",
  },
  servingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  servingContainer: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});