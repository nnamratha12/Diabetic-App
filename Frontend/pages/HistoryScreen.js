import { Avatar, Card, List, Text } from "react-native-paper";
import axios from "axios";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { BASE_URL,API_URL } from "@env";
import { firebase } from "../config";

const HistoryScreen = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const user = useSelector(state => state.user);
  const [userDates, setUserDates] = useState([]);
  const [userMealData, setUserMealData] = useState([]);
  const [bloodGlucoseBeforeMeal, setBloodGlucoseBeforeMeal] = useState(0)
  const [bloodGlucoseAfterMeal, setBloodGlucoseAfterMeal] = useState(0)
  const isFocused = useIsFocused();

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

  const handleDaySelect = day => {
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
      console.log("Day: ", day);
      axios.get(`${API_URL}/api/getDataByDate`, {
        params: {
          userId: user?.user?.uid,
          mealDate: day,
        },
      }).then(res => {
        console.log("Data: ", res);
        setUserMealData(res.data);
      }).catch(err => console.log("err: ", err));
    }
  };

  const parseDate = dateStr => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  }

  const formatDate = dateStr => parseDate(dateStr).toLocaleDateString('en-US', {
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



  const fetchBloodGlucoseAfterMeal = async (userId, mealDate) => {
    axios.get(`${API_URL}/api/getAllBloodGlucoseAfterMeal`, {
      params: {
        userId,
        mealDate,
       
      },
    }).then(response => {
      console.log("Response from getAllBloodGlucoseAfterMeal: ", response.data);
      
      setBloodGlucoseAfterMeal(response.data);
    }).catch(error => console.log("Error fetching blood glucose before meal: ", error));
  };


  

  const getBloodGlucose = (bloodGlucoseData, mealType) => {
    console.log("mealtype==>",bloodGlucoseData, mealType);
    const data = bloodGlucoseData.find(data => data.mealType === mealType);
    console.log("data?.bloodGlucoseBeforeMeal==>",data?.bloodGlucoseBeforeMeal);
    return data?.bloodGlucoseBeforeMeal;
  }

  const getBloodGlucoseAfterMeal = (bloodGlucoseData, mealType) => {
    console.log("mealtype==>",bloodGlucoseData, mealType);
    const data = bloodGlucoseData.find(data => data.mealType === mealType);
    console.log("data?.bloodGlucoseAfterMeal==>",data?.bloodGlucoseAfterMeal);
    return data?.bloodGlucoseAfterMeal;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Carbs Consumption History</Text>
      <List.Section>
        <List.Subheader style={styles.subheader}>Select a day to view carbs consumption:</List.Subheader>
        <View style={{ marginTop: 16 }} />
        {userDates.map(data => (
         
         <List.Accordion
            key={data.mealDate}
            title={(data.mealDate)}
           // title={formatDate(data.mealDate)}
            titleStyle={styles.accordionTitle}
            expanded={selectedDay === data.mealDate}
            onPress={() => {
              handleDaySelect(data.mealDate);
              fetchBloodGlucoseBeforeMeal(firebase.auth().currentUser.uid, data.mealDate);
              fetchBloodGlucoseAfterMeal(firebase.auth().currentUser.uid, data.mealDate);
            }}
           
            style={[styles.accordionItem, selectedDay === data.mealDate && styles.selectedItem]}
            left={props => <Avatar.Icon {...props} icon="calendar" style={styles.icon} color="white" />}
          >
            {selectedDay === data.mealDate && (
              <View style={[styles.mealRow, { marginTop: 16 }]}>
                {userMealData.map(mealData => (
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
                        {/* {mealData?.bloodGlucoseLevel ? (
                          `Blood Glucose After ${mealData?.mealType} : ${mealData?.bloodGlucoseAfterMeal} mmol/L`
                        ) : (
                          `Blood Glucose After ${mealData?.mealType} : No data available`
                        )} */}
                        {bloodGlucoseAfterMeal ? (
                          `Blood Glucose after ${mealData?.mealType} : ${getBloodGlucoseAfterMeal(bloodGlucoseAfterMeal, mealData?.mealType)} mmol/L`
                        ) : (
                          `Blood Glucose after ${mealData?.mealType} : No data available`
                        )}
                      </Text>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </List.Accordion>
        ))}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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

export default HistoryScreen;
