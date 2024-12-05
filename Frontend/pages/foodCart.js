
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions,ImageBackground } from "react-native";
import {
  Text,
  Button,
  List,
  Divider,
  useTheme,
  IconButton,
  Card,
  Title,
  Subheading,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { calculateCarbs, getInsulinDose } from "../utils/nutritionCalculation";
import { RemoveFoodItem } from "../redux/actions/actionTypes";
import { fetchFoodItemByIdAPI } from "../redux/actions/actions";
import axios from "axios";
import { BASE_URL, API_URL } from "@env";

const { width } = Dimensions.get("window");

const FoodCart = ({ navigation, route }) => {
  const { tag, manualCarbs=0 } = route?.params;
  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const foodData = useSelector((state) => state.api);
  const foodItems = useSelector((state) => state.addFood);
  let [totalCarbs, setTotalCarbs] = useState(0);
  const [insulinDose, setInsulinDose] = useState(0);
  const [previousCarbs, setPreviousCarbs] = useState(0);

  const calculateTotalCarbs = () => {
    let itemCarbs = foodItems?.foodItems?.length > 0 ? calculateCarbs(foodItems?.foodItems) : 0;
    return itemCarbs + (manualCarbs ? parseInt(manualCarbs, 10) : 0); // Add manual carbs input
  };

  const calculateInsulinDose = (totalCarbs) => {
    let icr;
   
      icr = user?.userProfInfo?.userProfData.dnICR;
   
    return icr ? (totalCarbs / icr).toFixed(2) : 0;
  };

  useEffect(() => {
    const updatedTotalCarbs = calculateTotalCarbs();
    setTotalCarbs(updatedTotalCarbs);
    setInsulinDose(calculateInsulinDose(updatedTotalCarbs));
  }, [foodItems, manualCarbs, tag]);

  const handleSave = () => {
    totalCarbs = calculateTotalCarbs();
    console.log("foodItems===>", foodItems);
   
    onSave();
    
    navigation.navigate("HomeScreen", {
      manualCarbs: totalCarbs,
      foodItems: foodItems,  // Ensure the latest foodItems is passeds
    });
  };
  const onSave = async () => {
    let userICR;
     console.log("tag", tag);
      userICR = user?.userProfInfo?.userProfData.mICR;
      console.log("ICR ===>", userICR);
  

    let params = {
      userId: user?.user?.uid,
      mealItems: foodItems?.foodItems || [],
      totalCarbs: totalCarbs,
      mealType: tag,
      insulinDose: insulinDose,
      userCRR: user?.userProfInfo?.userProfData.crr,
      userICR: userICR,
    };
    console.log("====> params:  ", params);
    console.log("====> BASE_URL:  ", API_URL);
    await axios
      .post(`${API_URL}/api/submitData`, params)
      .then(() => {
        console.log("Data submitted successfully.");
        dispatch(RemoveFoodItem([]));
        // navigation.navigate("HomeScreen", params);
      })
      .catch(e => console.log("Error: ", e));
  };

  const getCarbs = item => {
    let carbs;
    carbs = item.foodNutrients.find(y => parseInt(y.number) === 205);
    return carbs ? carbs.amount : 0;
  };

  const handleEditItem = fdcId => {
    const params = {
      format: "abridged",
      nutrients:
        "208,204,205,262,203,291,301,302,303,304,305,306,307,601,",
    };
    dispatch(fetchFoodItemByIdAPI(params, fdcId, tag));
  };

  const handleDeleteItem = fdcId => {
    const updatedArray = foodItems?.foodItems?.filter(item => item.fdcId !== fdcId);
    dispatch(RemoveFoodItem(updatedArray));
  };

  const EmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.emptyMessage}>Your cart is empty!</Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go Back
      </Button>
    </View>
  );

  const RightListView = ({ item }) => (
    <View>
      <Text style={styles.quantityText}>Quantity: {item?.count}</Text>
    </View>
  );

  const Content = () => (

<ImageBackground
    source={{ uri: 'https://img.freepik.com/free-photo/flat-lay-uncooked-spaghetti-penne-parmesan-with-copy-space_23-2148361276.jpg?semt=ais_hybrid' }} // Test URL
    style={styles.backgroundImage}
  >


    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.foodContainer}>
          <List.Section style={styles.listSection}>
            <List.Subheader>
              <Title style={styles.sectionHeader}>My Food Cart</Title>
            </List.Subheader>
            {foodItems?.foodItems?.map((item, index) => (
              <Card key={item.fdcId} style={styles.card}>
                <List.Item
                  key={index}
                  title={item.description}
                  description={`Carbs: ${getCarbs(item)}`}
                  right={() => <RightListView item={item} />}
                  titleStyle={styles.itemTitle}
                  descriptionStyle={styles.itemDescription}
                />
                <View style={styles.actionButtons}>
                  <IconButton
                    icon="pencil"
                    onPress={() => handleEditItem(item.fdcId)}
                    iconColor={theme.colors.primary}
                  />
                  <IconButton
                    icon="delete"
                    onPress={() => handleDeleteItem(item.fdcId)}
                    iconColor={theme.colors.error}
                  />
                </View>
              </Card>
            ))}
            

<input
        type="number"
        value={manualCarbs}
        // onChange={(e) => handleManualCarbsChange(e.target.value)}
        onChange={(e) => setTotalCarbs(parseInt(e.target.value, 10) + calculateCarbs(foodItems.foodItems || []))}
        placeholder="Enter manual carbs"
      />


          </List.Section>
        </View>

        <View style={styles.detailsContainer}>
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Subheading style={styles.totalText}>
                Total Carbs: {totalCarbs ? totalCarbs?.toFixed(2) : 0} g
              </Subheading>
              <Subheading style={styles.totalText}>
                Your Insulin Dose: {insulinDose ? insulinDose : 0} units
              </Subheading>
              <Button
                onPress= {handleSave}
                mode="contained"
                style={styles.saveButton}
              >
                Save
              </Button>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("FoodSearch", { tag })}
                style={styles.button}
              >
                Add More Food
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
    </ImageBackground>

  );

  return (
    <View style={styles.container}>
      {/* {foodItems?.foodItems?.length > 0 ? <Content /> : <EmptyCart />} */}
      {foodItems.foodItems?.length > 0 || manualCarbs ? <Content /> : <EmptyCart />}
    </View>
  );
};

export default FoodCart;

const styles = StyleSheet.create({


  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',

  },

  container: {
    flex: 1,
    padding: 8,
   // backgroundColor: "#f5f5f5",
  },
  emptyCartContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  emptyMessage: {
    fontSize: 24,
    marginBottom: 16,
    color: "#777",
  },
  button: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "#6200ee",
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  foodContainer: {
    width: "60%",
  },
  detailsContainer: {
    width: "35%",
  },
  listSection: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  quantityText: {
    fontSize: 14,
    color: "#777",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#777",
  },
  detailsCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  totalText: {
    fontSize: 18,
    paddingVertical: 8,
    color: "#333",
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#6200ee",
  },
});
