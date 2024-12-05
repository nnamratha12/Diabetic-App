import { StyleSheet, View, ScrollView,ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Button, Divider, IconButton, List, Text, Tooltip, useTheme, Card, Avatar } from "react-native-paper";
import AddCarbsModal from "../ui/addCarbsModal";
import { firebase } from "../config";
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL,API_URL } from "@env";

const ViewFood = ({ navigation, route }) => {
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
    const [readings, setReadings] = useState([]);

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
    const [dnICR, setDnICR] = useState("");
    const [crr, setCRR] = useState("");
    const [showSummary, setShowSummary] = useState(false);

    const [responseData, setResponseData] = useState(null);
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
                    console.log("userProf===>", userProf);
                    if (userProf.exists) {
                        const userProfData = userProf.data();
                        console.log("User data found.", userProfData);
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
                        setDnICR(userProfData.dnICR);
                        setCRR(userProfData.crr);

                        setTargetBloodGlucose(userProfData.targetBloodGlucose );
                        console.log("targetBloodGlucose.", targetBloodGlucose);
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
            mealType: "Meal",
        };
        setLoading(true);
        await axios.get(`${API_URL}/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`)
            .then(res => {
                setLoading(false);
                console.log("response==>", res.data.mealItems);
               // setFoodItems(res?.data ? res?.data?.mealItems : []);
               setFoodItems(res?.data ? res?.data.flatMap(item => item.mealItems || []) : []);
                console.log("Fooditems===>",foodItems);
                setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
                setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
                setObjectId(res?.data ? res?.data?._id : null);
                console.log("valuereadings==>", res?.data?.bloodGlucoseAfterMeal);
                setBloodGlucoseLevel(
                    res?.data?.bloodGlucoseAfterMeal ? res?.data?.bloodGlucoseAfterMeal : 0
                );
                console.log("valuereadings==>", bloodGlucoseLevel);
               
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

    const addBloodGlucose = async data => {
        let params = {
            _id: objectId,
            bloodGlucoseLevel: data,
        };
        setLoading(true);
        await axios
            .put(
                `${API_URL}/api/addBloodGlucose`,
                params
            )
            .then(res => {
                setLoading(false);
                navigation.goBack();
            })
            .catch(e => {
                setLoading(false);
                console.log("Error: ", e);
            });
    };

    const addBloodGlucoseBeforeMeal = async data => {
        let params = {
            userId: user?.user?.uid,
            mealType: tag,
            bloodGlucoseBeforeMeal: data,
        };
        setLoading(true);
        console.log("This the data we are saving for blood glucose:\n", params)
        await axios
            .post(
                `${API_URL}/api/addBloodGlucoseBeforeMeal`,
                params
            )
            .then(res => {
                console.log("Blood Glucose Before Meal API Response: ", res);
                setLoading(false);
                navigation.goBack();
            })
            .catch(e => {
                setLoading(false);
                console.log("Error : ", e);
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

    const handleSaveBloodGlucose = data => {
        addBloodGlucoseAfterMeal(data);
        setModalVisibleAfterMeal(false);
        setBloodGlucoseLevel(data);

    };

    useEffect(() => {
        console.log("Target: ", targetBloodGlucose, " Blood Glucose: ",bloodGlucoseLevel);
        if (targetBloodGlucose < bloodGlucoseLevel) {
            alert(" Blood glucose value is above the target");
        }
    }, [bloodGlucoseLevel]);

    const handleSaveBloodGlucoseBeforeMeal = data => {
        addBloodGlucoseBeforeMeal(data);
        setModalVisibleBeforeMeal(false);
    };

   

    
    const getCarbs = item => {
        // Check if the item has manual carbs
        console.log("item==>",item);
        if (item.manualCarbs) {
            return item.manualCarbs; // Return the manually entered carbs
        }
    
        // Otherwise, calculate carbs from food nutrients
        let carbs = 0;
        if (item.foodNutrients?.length >0) {
            const carbNutrient = item.foodNutrients.find(y => parseInt(y.number) === 205);
            carbs = carbNutrient ? carbNutrient.amount : 0;
        }
        else{
            return item.totalCarbs;
        }
    
        return carbs;
    };
    
    const getTotalCarbs = (dataItem,item) => {
        // Check if the item has manual carbs
        console.log("item==>",dataItem);
    
        // Otherwise, calculate carbs from food nutrients
        let carbs = 0;
        if (item.foodNutrients?.length >0) {
            const carbNutrient = item.foodNutrients.find(y => parseInt(y.number) === 205);
            carbs = carbNutrient ? carbNutrient.amount : 0;
        }
        else{
            return dataItem.totalCarbs;
        }
    
        return carbs;
    
    };

    const displayManualCarbs= (dataItem,item) => {
       
    
        return getAllCarbs(dataItem,item) - getTotalCarbs(dataItem,item);
    
    };

    const getAllCarbs = (dataItem,item) => {
        // Check if the item has manual carbs
        console.log("item==>",dataItem);
    
       return dataItem.totalCarbs;
      
    
       
    
    
    };


    const onAddFood = mealItems => navigation.navigate("FoodSearch", { tag: mealItems, fromEditMeal: false });

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
               
                    data = {
                        dnICR: userICR,
                    };
                // }
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

   

    const getCorrectionFactor =  (bloodGlucoseAfterMeal1,targetBloodGlucose1,userCRR1) => {
        try {
            console.log(`Blood Glucose Level: ${bloodGlucoseAfterMeal1}`);
            console.log(`Target Blood Glucose: ${targetBloodGlucose1}`);
            console.log('User CRR: ', userCRR1);
            const x = (bloodGlucoseAfterMeal1 - targetBloodGlucose1) / userCRR1;
            // Round to the nearest half
            const y=  Math.round(x * 2) / 2;
            console.log("x,y ==>", x,y);
            return y;

        } catch (error) {
            console.log(error);
            throw error;
        }
    };




    const getGlucoseData = async (userId, mealType) => {
        try {
          // Construct the URL with query parameters
          const url = `${API_URL}/api/getFoodItemsByMealType?mealType=${mealType}&userId=${userId}`;
          
          // Make the API call
          const response = await fetch(url);
          const data = await response.json();
          console.log("data==>", data);
          
        return data.bloodGlucoseAfterMeal;
    } catch (error) {
        console.log(error);
        throw error;
    }
    
      };


    const handleDaySelect = day => {
        if (selectedDay === day) {
          setSelectedDay(null);
        } else {
          setSelectedDay(day);
          console.log("Day: ", day);
          axios.get(`${API_URL}/api/getDataByDate`, {
            params: {
              userId: user?.user?.uid,
              mealDate: new Date().toLocaleDateString('en-GB'),
            },
          }).then(res => {
            console.log("Data: ", res);
            setUserMealData(res.data);
          }).catch(err => console.log("err: ", err));
        }
      };



      const addBloodGlucoseAfterMeal = async (data) => {
        let params = {
          userId: user?.user?.uid,
          // mealType: mealType,
          bloodGlucoseAfterMeal: data,
          //bloodglucoseentryTime: new Date().toLocaleDateString("en-GB"),
        };
        setLoading(true);
        console.log("This the data we are saving for blood glucose:\n", params)
        await axios
          .post(
            `${API_URL}/api/addBloodGlucoseAfterMeal`, params
          )
          .then(res => {
            console.log("Blood Glucose After Meal API Response: ", res);
            setLoading(false);
            navigation.goBack();
          })
          .catch(e => {
            setLoading(false);
            console.log("Error : ", e);
          });
      };


      const getBloodGlucoseAfterMealByUserId =  () => {
        let params = {
          userId: user?.user?.uid,
         
        };
        // setLoading(true);
        console.log("This the data we are saving for blood glucose1:\n", params)
        console.log("URL=====>", API_URL);
        axios
          .get(
             `${API_URL}/api/getBloodGlucoseAfterMealByUserId`, params
           
          )
          .then(res => {
            console.log("Blood Glucose After Meal API Response: ", res);
           
            return res.data;
          })
          .catch(e => {
            setLoading(false);
            console.log("Error : ", e);
          });
      };

      useEffect(() => {
        const fetchReadings = async () => {
          let params = {
            userId: user?.user?.uid,
          };
            try {
                
    
                const url = `${API_URL}/api/getBloodGlucoseAfterMealByUserId?userId=${user?.user?.uid}`;
                const response = await fetch(url);
                console.log("response===>", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("data1===>", data);
                setReadings(data);
                console.log("setReadings1===>",readings);
                 console.log("setReadings===>",readings.bloodGlucoseAfterMeal );
            } catch (error) {
                console.error('Error fetching readings:', error);
                setError(error.message);
            } finally {
                setLoading(false); // Stop the loading spinner
            }
        };
    
        fetchReadings();
    }, []);
    


    const formatTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false, // 24-hour format
        });
      };


      const handleButtonClick = async (userId, mealType,bloodGlucoseAfterMeal) => {
        try {
          // Construct the URL with query parameters
          const url = `${API_URL}/api/getFoodItemsByMealType?mealType=${mealType}&userId=${userId}`;
          
          // Make the API call
          const response = await fetch(url);
          const data = await response.json();
          console.log("data==>", data);
          let totalNutrientsAmount = 0;
          let totalCarbsAllItems = 0;

          // Set the response data to be displayed
          data.bloodGlucoseAfterMeal=bloodGlucoseAfterMeal;
          
          const updatedData = data.map(item => {
            const updatedMealItems = item.mealItems.map(mealItem => {
             // let totalNutrientsAmount = 0;
      
              // Iterate through each food nutrient and sum the amounts
              mealItem.foodNutrients.forEach(nutrient => {
                console.log("each na==>",nutrient.amount);
                if (nutrient.amount && !isNaN(nutrient.amount)  && nutrient.name === "Carbohydrate, by difference") {
                  totalNutrientsAmount += nutrient.amount;
                }
              });
      
              // Add the total nutrient amount to the meal item object
             
            });
      
            // Add the updated meal items to the item object
            totalCarbsAllItems += item.totalCarbs;
          });
      console.log("totalNutrientsAmount==>",totalNutrientsAmount,  totalCarbsAllItems);
    data.differneceCarbs = totalCarbsAllItems - totalNutrientsAmount;
          setResponseData(data);
          console.log("data34===>",data);
      
        } catch (error) {
          console.error("Error fetching data:", error);
          setResponseData({ error: "Failed to fetch data" });
        }
      };
    

    return (
        <ImageBackground
    source={{ uri: 'https://img.freepik.com/premium-photo/medicine-with-measuring-syringe-thermometer-lies-side-against-white-background-hi_444350-547.jpg?semt=ais_hybrid' }} // Test URL
    style={styles.backgroundImage}
  >
        <ScrollView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.leftContainer}>
                    {console.log(`showSummary: ${showSummary}`)}
                    {showSummary ? (
                        <>
                            <List.Section style={styles.listSection}>
                                <List.Subheader>
                                    <Text style={styles.sectionHeader}>Today's {tag}</Text>
                                </List.Subheader>
                                {console.log("Fooditems==>",foodItems)}

                                {foodItems?.map((item, index) => (
                                    <List.Item
                                        key={index}
                                        titleEllipsizeMode="tail"
                                        titleNumberOfLines={5}
                                        title={item.description}
                                        description={`Carbs: ${getCarbs(item)}`}
                                        right={() => <RightListView item={item} />}
                                        style={styles.listItem}
                                    />
                                ))}
                            </List.Section>
                            <View style={styles.view}>
                                {totalCarbs > 0 && (
                                    <Text variant="titleMedium">
                                        Total Carbs Consumed - {Number(totalCarbs).toFixed(2)} g
                                    </Text>
                                )}

                                {insulinDose > 0 && (
                                    <Text variant="titleMedium">
                                        Total Insulin Dose - {insulinDose} units
                                    </Text>
                                )}

                              
                            </View>
                           

                        </>
                    ) : (
                        <View style={styles.emptyCartContainer}>
                            {console.log(`Is Loading?: ${loading}`)}
                            {loading ? (
                                <ActivityIndicator size="large" style={styles.activityIndicator} color={theme.colors.primary} />
                            ) : (
                                <>
                                    
                  <Button
                                                    mode="contained"
                                                    onPress={() => setModalVisibleAfterMeal(true)}
                                                    style={styles.button}
                                                    labelStyle={styles.buttonLabel}
                                                >
                                                    Add Blood Glucose Reading After Meal
                                                </Button>
                                                <AddCarbsModal
                                                    visible={modalVisibleAfterMeal}
                                                    placeholder={"Enter Blood Glucose Reading After Meal"}
                                                    onDismiss={() => setModalVisibleAfterMeal(false)}
                                                    onSave={bloodGlucoseLevel => handleSaveBloodGlucose(bloodGlucoseLevel)}
                                                /> 
                                                 <Button
                                            mode="contained"
                                            onPress={() => navigation.navigate("Form")}
                                            style={styles.button}
                                            labelStyle={styles.buttonLabel}
                                        >
                                            Consult a Questionnaire
                                        </Button>
                                                


<div>
<h2 style={{ textAlign: 'center' }}>Today's Readings</h2>
      {readings.length > 0 ? (
        <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Blood Glucose Level</th>
              <th>Entry Time</th>
              <th>Meal Type</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{reading.bloodGlucoseAfterMeal}</td>
                <td>{formatTime(reading.bloodglucoseentryTime)}</td>
                <td>{reading.mealType}</td>
                <td>
                  <button onClick={() => handleButtonClick(reading.userId, reading.mealType,reading.bloodGlucoseAfterMeal)}
                    style={{
                        backgroundColor: '#007BFF', // Blue background color
                        color: '#fff', // White text color
                        transition: 'background-color 0.3s',
                        border: 'none', // Remove border
    borderRadius: '5px', // Rounded corners
    padding: '10px 20px',
     fontSize: 12,
     fontWeight: "bold"
                      }}
                    >SUMMARY</button>
                </td>
                {/* <td><Text variant="titleMedium">
                                                    Your correction dose - {getCorrectionFactor(reading.bloodGlucoseAfterMeal,userProfData.targetBloodGlucose)}
                                                </Text></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No readings available</p>
      )}




{responseData && responseData.length > 0 && (
  <List.Section title="Meal Items">
    

    {/* Main list rendering */}
    {responseData.map((dataItem, index) => (
      dataItem?.mealItems?.map((item, itemIndex) => (
        <List.Item
          key={`${index}-${itemIndex}`}
          //title={item.description}
          description={() => (
            <View>
                {itemIndex === 0 && (
            
                <>
               <Text>{dataItem.mealType}</Text>
               <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginVertical: 5 }} />
                <Text>Insulin Dose: {dataItem.insulinDose} units</Text>
                <Text>Your correction dose: {getCorrectionFactor(responseData.bloodGlucoseAfterMeal, targetBloodGlucose, dataItem.userCRR)}</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginVertical: 5 }} />
              </> 
              )}
               {itemIndex === 0 && (
            
            <>
             
             <Text>Food: {"Manual Entry"}</Text>
            <Text>Carbs: {responseData.differneceCarbs} g</Text>
            <View style={{  marginVertical: 10 }} />
          </> 
          )}
           {item.description !== "Manual Entry" && (
            
            <>
             
            <Text>Food: {item.description}</Text>
            <Text>Carbs: {getTotalCarbs(dataItem, item)} g | Quantity: {item.count}</Text>
            <View style={{  marginVertical: 10 }} />
          </> 
          )}
              
              
              
            </View>
          )}
          style={styles.listItem}
        />
      ))
    ))}
  </List.Section>
)}

    </div>


 

                                    <>
                                        <List.Section style={styles.listSection}>
                                            
                                        </List.Section>
                                        <View style={styles.view}>
                                            {totalCarbs > 0 && (
                                                <Text variant="titleMedium">
                                                    Total Carbs Consumed - {Number(totalCarbs).toFixed(2)} g
                                                </Text>
                                            )}

                                            {insulinDose > 0 && (
                                                <Text variant="titleMedium">
                                                    Total Insulin Dose - {insulinDose} units
                                                </Text>
                                            )}

                                           
                                        </View>
                                        
                                    </>

                                </>
                            )}
                        </View>
                    )}
                  
                </View>

             
                </View>
           
        </ScrollView >
        </ImageBackground>
    );
};

export default ViewFood;

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
      },
    container: {
        flex: 1,
        padding: 16,
      
    },

    mainContent: {
        flexDirection: 'row',
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
    horizontalDivider: {
        height: '100%',
        width: 1,
        backgroundColor: '#dddddd',
        marginVertical: 16,
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
        backgroundColor: '#007BFF', // Bright blue background color
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
        alignItems: 'center'
     },
     buttonLabel: {
    fontSize: 16,
     fontWeight: "bold",
    color: "#fff",
    textTransform: 'uppercase',
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