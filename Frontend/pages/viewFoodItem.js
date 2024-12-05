

import { StyleSheet, View, ScrollView ,ImageBackground} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Button, Divider, IconButton, List, Text, Tooltip, useTheme, Card, Avatar, TextInput } from "react-native-paper";
import AddCarbsModal from "../ui/addCarbsModal";
import { firebase } from "../config";
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL,API_URL } from "@env";

const ViewFoodItem = ({ navigation, route }) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector(state => state.user);
  const { tag } = route?.params;
  const [objectId, setObjectId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState("");
  const [insulinDose, setInsulinDose] = useState(0);
  const [userCRR, setUserCRR] = useState(0);
  const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState(0);
  const [targetBloodGlucose, setTargetBloodGlucose] = useState(0);
  const [bloodGlucoseLevelBeforeMeal, setBloodGlucoseLevelBeforeMeal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
  const [modalVisibleAfterMeal, setModalVisibleAfterMeal] = useState(false);
  const [userICR, setUserICR] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [userMealData, setUserMealData] = useState([]);
  const [foodDetails, setFoodDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [manualCarbs, setManualCarbs] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [carbs, setCarbs] = useState('');



  useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;

      if (user) {
        const userId = user.uid;
        const userProfRef = firebase.firestore()
          .collection("userProfile")
          .doc(userId);

        const userProf = await userProfRef.get();

        if (userProf.exists) {
          const userProfData = userProf.data();
          setTargetBloodGlucose(userProfData.targetBloodGlucose);
        } else {
          console.log("User profile data not found.");
        }
      } else {
        console.log("No user is currently logged in.");
      }
    };
    fetchUserData();
  });

  const [userStateData, setUserStateData] = useState({});
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [age, setAge] = useState("");
  const [breakfastStartHour, setBreakfastStartHour] = useState({});
  const [breakfastEndHour, setBreakfastEndHour] = useState({});
  const [lunchStartHour, setLunchStartHour] = useState({});
  const [lunchEndHour, setLunchEndHour] = useState({});
  const [dinnerStartHour, setDinnerStartHour] = useState({});
  const [dinnerEndHour, setDinnerEndHour] = useState({});
  const [bfICR, setBfICR] = useState("");
  const [lhICR, setLhICR] = useState("");
  const [mICR, setMICR] = useState("");
  const [crr, setCRR] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  

  useEffect(() => {
    if (isFocused) {
      const fetchUserData = async () => {
        const user = firebase.auth().currentUser;

        if (user) {
          const userId = user.uid;
          const userDocRef = firebase.firestore()
            .collection("users")
            .doc(userId);
          const userProfRef = firebase.firestore()
            .collection("userProfile")
            .doc(userId);

          const userDoc = await userDocRef.get();
          const userProf = await userProfRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserStateData(userData);
            dispatch({
              type: "userData",
              payload: { userData },
            });
          } else {
            console.log("User data not found.");
          }

          if (userProf.exists) {
            const userProfData = userProf.data();
            setWeight(userProfData.weight);
            setHeightFt(userProfData.heightFt);
            setHeightIn(userProfData.heightIn);
            setAge(userProfData.age);
            setBreakfastStartHour(userProfData.breakfastStartHour);
            setBreakfastEndHour(userProfData.breakfastEndHour);
            setLunchStartHour(userProfData.lunchStartHour);
            setLunchEndHour(userProfData.lunchEndHour);
            setDinnerStartHour(userProfData.dinnerStartHour);
            setDinnerEndHour(userProfData.dinnerEndHour);
            setBfICR(userProfData.bfICR);
            setLhICR(userProfData.lhICR);
            setMICR(userProfData.mICR);
            setCRR(userProfData.crr);
            setTargetBloodGlucose(userProfData.targetBloodGlucose);
          } else {
            console.log("User profile data not found.");
          }
        } else {
          console.log("No user is currently logged in.");
        }
      };
      fetchUserData();
    }
  }, [isFocused]);

  const getUpdatedUserICR = async () => {
    console.log("HER: ", user?.user?.uid, tag);
    await axios
      .get(`${API_URL}/api/updateUserICR`, {
        params: {
          userId: user?.user?.uid,
          mealType: tag,
        },
      })
      .then(res => {
        console.log("Response from Update ICR: ", res);
        setUserICR(res.data);
      })
      .catch(err => console.log("Err: ", err));
  };

  const getFoodItems = async () => {
    let params = {
      userId: user?.user?.uid,
      mealType: tag,
    };
    setLoading(true);
    await axios.get(`${API_URL}/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`)
      .then(res => {
        setLoading(false);
        console.log("abc==>",res.data.targetBloodGlucose);
        setFoodItems(res?.data ? res?.data?.mealItems : []);
        setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
        setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
        setObjectId(res?.data ? res?.data?._id : null);
        setBloodGlucoseLevel(
          res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
        );
        setTargetBloodGlucose(
          res?.data?.targetBloodGlucose ? res?.data?.targetBloodGlucose : 0
        )
        setUserCRR(res?.data?.userCRR);
        console.log("This is the data: ", res.data)
        console.log("This is crr: ", res?.data?.userCRR);
        console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);
        console.log("Data: ", res, res?.data ? res?.data?.mealItems : []);
      }).catch(e => {
        setLoading(false);
        console.log("Error: ", e);
      });
  };

  

  const getBloodGlucoseBeforeMeal = async () => {
    let params = {
      userId: user?.user?.uid,
      mealType: tag,
    };
    setLoading(true);
    await axios.get(`${API_URL}/api/getBloodGlucoseBeforeMeal?userId=${params.userId}&mealType=${params.mealType}&mealDate=${new Date().toLocaleDateString('en-GB')}`)
      .then(res => {
        setLoading(false);
        setBloodGlucoseLevelBeforeMeal(
          res?.data?.bloodGlucoseBeforeMeal ? res?.data?.bloodGlucoseBeforeMeal : 0
        );
        console.log("Getting data: ", res);
        console.log("This is blood glucose before meal: ", res?.data?.bloodGlucoseBeforeMeal);

      })
      .catch(e => {
        setLoading(false);
        console.log("Error: ", e);
      });
  };

  useEffect(() => {
    getUpdatedUserICR();
    getBloodGlucoseBeforeMeal();
    getFoodItems();
  }, []);

 
  const getCarbs = item => {
    let carbs = 0;
    carbs = item.foodNutrients.find(y => {
      return parseInt(y.number) === 205;
    });
    return carbs ? carbs.amount : 0;
  };

  
  
  const onAddFood = () => {console.log(tag)
    navigation.navigate("FoodSearch", { tag, fromEditMeal: false })
  };


  const updateUserICR = async () => {
    console.log("Update UserICR");
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = firebase
          .firestore()
          .collection("userProfile")
          .doc(userId);
        let data = {};
        if (tag === "Breakfast") {
          data = {
            bfICR: userICR,
          };
        } else if (tag === "Lunch") {
          data = {
            lhICR: userICR,
          };
        } else {
          data = {
            mICR: userICR,
          };
        }
        await userDocRef.set(data, { merge: true });
        console.log("Data to Deliver: ", data);
        alert("Updated successfully");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const RightListView = ({ item }) => (
    <View>
      <Text style={styles.quantityText}>Quantity: {item?.count}</Text>
    </View>
  );

 
  const handleCarbsChange = (value) => {
    setManualCarbs(value);
  };

  // Handler to save the carbs value and navigate to FoodCart
  const handleSaveCarbs = () => {
    const carbAmount = parseInt(manualCarbs, 10);
    if (isNaN(carbAmount) || carbAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid carb amount');
      return;
    }

    
    setSaveMessage(`Carbs saved: ${carbAmount}`);

    // Navigate to the FoodCart after saving
    navigation.navigate('FoodCart', { manualCarbs: carbAmount, tag: tag });
  };     



  return (
    <ImageBackground
    source={{ uri: 'https://img.freepik.com/free-photo/sport-equipment_23-2148148983.jpg?semt=ais_hybrid' }} // Test URL
    style={styles.backgroundImage}
  >
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
      {(foodItems && foodItems.length <= 0) && (
  <>
    <Text>No food items available</Text>
  </>
)}
      
                  <Button
                        mode="contained"
                        onPress= {onAddFood}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                      >
                        Add Food Here
                      </Button>

                      <TextInput
        style={styles.input}
        placeholder="Enter carbs"
        keyboardType="numeric"
        value={manualCarbs}
        onChangeText={handleCarbsChange}
        placeholderTextColor="#888"
      />

      {/* Save Button */}
      <Button
        mode="contained"
        onPress={handleSaveCarbs}  // Trigger save function on press
        style={styles.buttons}  // Custom button style
        labelStyle={styles.buttonLabels}  // Custom label style
      >
        Save Carbs
      </Button>

      {/* Success Message after saving */}
      {saveMessage ? <Text style={styles.message}>{saveMessage}</Text> : null}
             
          
      </View>
    </ScrollView >
    </ImageBackground>
  );
};

export default ViewFoodItem;

const styles = StyleSheet.create({


  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',

  },


  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: "#f7f7f7",
  },
  mainContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    paddingRight: 16,
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 16,
  },
 
  emptyCartContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    color: "#555555",
    textAlign: "center",
    marginBottom: 16,
  },
 
  button: {
    marginTop: 30, // Add some space above the button
    marginBottom: 20, // Add some space below the button
    paddingHorizontal: 20, // Increased horizontal padding for a wider button
    backgroundColor: 'blue', // Bright blue background color
    borderRadius: 20, // Rounded corners for a modern look
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for subtle lift
    shadowOpacity: 0.1, // Shadow transparency
    shadowRadius: 8, // Shadow blur for soft edges
    justifyContent: 'center', // Center the content vertically
    alignSelf: 'center', // Center the content horizontally
    width: '35%', // Set width as a percentage of the parent container
    height: 50, // Increase height for a more prominent button
    alignItems: 'center',
},
buttonLabel: {
    color: '#fff', // White text color for good contrast
    fontSize: 16, // Slightly larger font size for better readability
    fontWeight: 'bold', // Bold font for emphasis
    textTransform: 'uppercase', // Uppercase text for added emphasis
},
 
  input: {
    height: 50, // Increased height for better usability
    width: '60%', // Set width as a percentage of the parent container
    borderColor: '#007BFF', // Blue border color
    borderWidth: 1, // Thin border around the box
    borderRadius: 8, // Rounded corners for a modern look
    paddingHorizontal: 10, // Internal padding for text
    fontSize: 16, // Font size for input text
    backgroundColor: '#fff', // Clean white background
    marginVertical: 8, // Space above and below the input box
    color: '#333', // Text color for better readability
    shadowColor: '#000', // Shadow color for depth
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for subtle effect
    shadowOpacity: 0.1, // Shadow transparency
    shadowRadius: 3, // Blur for the shadow
    alignSelf: 'center', // Center the input box horizontally
    marginTop:30, // Space above the text box for separation from the button
    marginBottom: 30,
},
  
 
  buttons: {
    marginTop: 30, // Add some space above the button
    marginBottom: 10, // Add some space below the button
    paddingHorizontal: 20, // Increased horizontal padding for a wider button
    backgroundColor: 'blue', // Bright blue background color
    borderRadius: 20, // Rounded corners for a modern look
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for subtle lift
    shadowOpacity: 0.1, // Shadow transparency
    shadowRadius: 8, // Shadow blur for soft edges
    justifyContent: 'center', // Center the content vertically
    alignSelf: 'center', // Center the content horizontally
    width: '35%', // Set width as a percentage of the parent container
    height: 50, // Increase height for a more prominent button
    alignItems: 'center',
},
buttonLabels: {
    color: '#fff', // White text color for good contrast
    fontSize: 16, // Slightly larger font size for better readability
    fontWeight: 'bold', // Bold font for emphasis
    textTransform: 'uppercase', // Uppercase text for added emphasis
},
  listSection: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  listItem: {
    marginVertical: 4,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    color: "#777777",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
    height: 1,
    backgroundColor: "#dddddd",
  },
  view: {
    alignSelf: "center"
  }
});