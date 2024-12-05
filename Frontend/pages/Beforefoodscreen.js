import { Avatar, Card, List, Text, Button, FlatList } from "react-native-paper";
import axios from "axios";
import { ScrollView, StyleSheet, View,ImageBackground } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { BASE_URL, API_URL } from "@env";
import { firebase } from "../config";
import AddCarbsModal from "../ui/addCarbsModal";



const Beforefoodscreen = ({ navigation, route }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const user = useSelector(state => state.user);
  const [userDates, setUserDates] = useState([]);
  const [userMealData, setUserMealData] = useState([]);
  const [bloodGlucoseBeforeMeal, setBloodGlucoseBeforeMeal] = useState(0)
  const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [bloodGlucoseData = [], setBloodGlucoseData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const handlePress = () => setExpanded(!expanded);
  const [readings, setReadings] = useState([]);  // State to store readings
  const [error, setError] = useState(null);


  useEffect(() => {
    if (isFocused) {
      console.log("User Id: ", user);
      const fetchUserDates = async () => {
        axios.get(`${API_URL}/api/userDates`, {
          params: {
            userId: user?.user?.uid,
          },
        }).then(res => {
          console.log("Dates: ", res);
          setUserDates(res.data);
        }).catch(err => console.log("Err: ", err));
      };
      fetchUserDates();
    }
  }, [isFocused, user]);



 


  const parseDate = dateStr => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  }

  const formatDate = dateStr => parseDate(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fetchBloodGlucoseBeforeMeal = async (userId, mealDate) => {
    axios.get(`${API_URL}/api/getAllBloodGlucoseBeforeMeal`, {
      params: {
        userId,
        mealDate,
      },
    }).then(response => {
      console.log("Response from getAllBloodGlucoseBeforeMeal: ", response.data);
      setBloodGlucoseBeforeMeal(response.data);
    }).catch(error => console.log("Error fetching blood glucose before meal: ", error));
  };

  const getBloodGlucose = (bloodGlucoseData, mealType) => {
    const data = bloodGlucoseData.find(data => data.mealType === mealType);
    return data?.bloodGlucoseBeforeMeal;
  }

  const handleSaveBloodGlucoseBeforeMeal = (data) => {
    addBloodGlucoseBeforeMeal(data);
    setModalVisibleBeforeMeal(false);
  };



  const addBloodGlucoseBeforeMeal = async (data) => {
    let params = {
      userId: user?.user?.uid,
      
      bloodGlucoseBeforeMeal: data,
    
    };
    setLoading(true);
    console.log("This the data we are saving for blood glucose:\n", params)
    await axios
      .post(
        `${API_URL}/api/addBloodGlucoseBeforeMeal`, params
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

  const getBloodGlucoseBeforeMealByUserId =  () => {
    let params = {
      userId: user?.user?.uid,
    
    };
    
    console.log("This the data we are saving for blood glucose1:\n", params)
    console.log("URL=====>", API_URL);
    axios
      .get(
         `${API_URL}/api/getBloodGlucoseBeforeMealByUserId`, params
        
      )
      .then(res => {
        console.log("Blood Glucose Before Meal API Response: ", res);
       
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
           

            const url = `${API_URL}/api/getBloodGlucoseBeforeMealByUserId?userId=${user?.user?.uid}`;
            const response = await fetch(url);
            console.log("response===>", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("data1===>", data);
            setReadings(data);
            console.log("setReadings1===>",readings);
             console.log("setReadings===>",readings.bloodGlucoseBeforeMeal );
        } catch (error) {
            console.error('Error fetching readings:', error);
            setError(error.message);
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    fetchReadings();
}, []);






  


  const fetchUserDates = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/userDates`, {
        params: { userId: user?.user?.uid },
      });
      console.log("User Dates: ", res.data);
      setUserDates(res.data);
    } catch (err) {
      console.log("Error fetching user dates: ", err);
    }
  };


  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
    });
  };


  return (
    <ImageBackground
    source={{ uri: 'https://img.freepik.com/free-photo/lab-equipment-frame-with-copy-space_23-2148882085.jpg?semt=ais_hybrid' }} // Test URL
    style={styles.backgroundImage}
  >
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Carbs Consumption History</Text> */}
      <List.Section>
        {/* <List.Subheader style={styles.subheader}>Select a day to view carbs consumption:</List.Subheader> */}
        <View style={{ marginTop: 16 }} />
       
        <Button
          mode="contained"
          onPress={() => setModalVisibleBeforeMeal(true)}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Add Blood Glucose Reading Before Meal
        </Button>

     

<AddCarbsModal
  visible={modalVisibleBeforeMeal}
  placeholder={"Enter the reading Before Meal"}
  onDismiss={() => setModalVisibleBeforeMeal(false)}
  onSave={(bloodGlucose) => {
    // Validation logic to allow only integers
    const isInteger = /^\d+$/.test(bloodGlucose); // Regex to check for integer
    if (isInteger) {
      handleSaveBloodGlucoseBeforeMeal(parseInt(bloodGlucose, 10));
    } else {
      alert("Please enter a valid integer.");
    }
  }}
/>




      





<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
  <div style={{ width: '40%', overflowX: 'auto' }}>
    <h2 style={{ textAlign: 'center' }}>Today's Readings</h2>
    {readings.length > 0 ? (
      <table
        border="1"
        style={{
          width: '100%', // Set the table width to 100% of its container (60%)
          margin: '0 auto', // Center the table within its container
          textAlign: 'left',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Blood Glucose Level</th>
            <th>Entry Time</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{reading.bloodGlucoseBeforeMeal}</td>
              <td>{formatTime(reading.bloodglucoseentryTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p style={{ textAlign: 'center' }}>No readings available</p>
    )}
  </div>
</div>







{/* <div>
            <h1>Before Food Readings</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : readings && readings.bloodGlucoseBeforeMeal ? (
            
                <table>
                    <thead>
                        <tr>
                            <th>Blood Glucose Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{readings[0].bloodGlucoseBeforeMeal}</td> 
                            <td>{readings[0].bloodglucoseentryTime}</td> 
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No readings available</p>
            )}
        </div> */}




{/* <div>
            <h1>Before Food Readings</h1>
            <h1>(readings.bloodGlucoseBeforeMeal)</h1>
        </div> */}




        {/* <List.Section>
          <List.Accordion title="Today's Readings">
            {readings.length > 0 ? (
              readings.map((reading, index) => (
                <tr key={index}>
                  <td>{reading.bloodGlucoseBeforeMeal}</td>
                </tr>
              ))
            ) : (
              <p>No readings available</p>
            )}
          </List.Accordion>
        </List.Section> */}
        


        {/* {selectedDay === mealType && (
              <View style={[styles.mealRow, { marginTop: 16 }]}> */}
        {/* {userMealData.map(mealData => (
                  <Card key={mealData._id} style={styles.card}>
                    <Card.Content>
                       <Text style={styles.mealText}>
                        {mealData?.mealType} : {mealData?.totalCarbs.toFixed(2)} Carbs Taken
                      </Text>
                      <Text style={styles.mealText}>
                        Insulin Dose Taken : {mealData?.insulinDose} units
                      </Text>
                      <Text style={styles.mealText}>
                        {bloodGlucoseBeforeMeal ? (
                          `Blood Glucose before ${mealData?.mealType} : ${getBloodGlucose(bloodGlucoseBeforeMeal, mealData?.mealType)} mmol/L`
                        ) : (
                          `Blood Glucose before ${mealData?.mealType} : No data available`
                        )}
                      </Text> 
                       <Text style={styles.mealText}>
                        {mealData?.bloodGlucoseLevel ? (
                          `Blood Glucose After ${mealData?.mealType} : ${mealData?.bloodGlucoseLevel} mmol/L`
                        ) : (
                          `Blood Glucose After ${mealData?.mealType} : No data available`
                        )}
                      </Text> 
                    </Card.Content>
                  </Card>
                ))} */}
        {/* </View>
            )}
          </List.Accordion>
        ))} */}
      </List.Section>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',

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
 
  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: '#333333',
  },
  
  subheader: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 8,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#333333',
  },
  accordionItem: {
    marginVertical: 4,
  },
  selectedItem: {
    backgroundColor: "#e0f7fa",
  },
  mealText: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 8,
  },
  icon: {
    backgroundColor: '#2A6BBF',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    marginHorizontal: 8,
    minWidth: '30%',
  },
  mealRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 16, // Space above the tiles
  },
});

export default Beforefoodscreen;
