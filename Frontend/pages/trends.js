import { Text } from "react-native-paper";
import axios from "axios";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { BASE_URL , API_URL} from "@env";
import { firebase } from "../config";
const screenWidth = Dimensions.get("window").width;

const Trends = () => {
  const user = useSelector(state => state.user);

  let [userDates, setUserDates] = useState([]);
  const [dataForTrends, setDataForTrends] = useState([]);
  const [tag, setTag] = useState("Meal");
  const [userMealData, setUserMealData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Fetch userDates
      console.log("UserID when fetching userDates: ",user?.user?.uid);
      console.log("API_URL ====>",API_URL);

      axios.get(`${API_URL}/api/userDates?userId=${firebase.auth().currentUser?.uid}`, {
        // params: {
        //   userId: user?.user?.uid,
        // },
      }).then(res => {
        console.log("Dates: ", res);
        setUserDates(res.data.slice(-7));
        console.log("Dates===> ", userDates);
        // Now you can fetch dataForTrends using mealDate
  
        axios.get(`${API_URL}/api/getUserData?userId=${firebase.auth().currentUser?.uid}`, {
          // params: {
          //   userId: user?.user?.uid,
          // },
        }).then(dataRes => {
          console.log("Data for Trends: ", dataRes);
          setUserMealData(dataRes.data);
        }).catch(err => console.log("Error fetching data for Trends: ", err));
      }).catch(err => console.log("Error fetching user dates: ", err));
    }
  }, [isFocused, user]);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(19, 86, 186, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };
  console.log("Dates1===> ", userDates);
  if (!Array.isArray(userDates)) {
    userDates = [];
  
  }
  console.log("Dates2===> ", userDates);
  const carbsGraphData = {
    
    labels: userDates.map(data => data.mealDate),
    datasets: [
      {
        data: userDates.map(date => {
          console.log("matchingData1==>",userMealData);
          const matchingData = userMealData.filter(item => item.mealDate === date.mealDate )
          console.log("matchingData==>",matchingData);
          // console.log("date.mealDate==>",date.mealDate);
          // if (matchingData) {
          //   return parseFloat(matchingData.totalCarbs);
          // }
          if (matchingData.length > 0) {
            // Sum up total carbs
            const totalCarbs = matchingData.reduce((sum, item) => sum + parseFloat(item.totalCarbs || 0), 0);
            return totalCarbs;
          }  
          else {
            // Handle the case where no data is found (e.g., use a default value)
            return 0;
          }
        }),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const insulinGraphData = {
    labels: userDates.map(data => data.mealDate),
    datasets: [
      {
        data: userDates.map(date => {
          const matchingData = userMealData.filter(item => item.mealDate === date.mealDate );

          // if (matchingData)
          //   return parseFloat(matchingData.insulinDose);
          if (matchingData.length > 0) {
            // Sum up total carbs
            const insulinDose = matchingData.reduce((sum, item) => sum + parseFloat(item.insulinDose || 0), 0);
            return insulinDose;
          }  
          else
            return 0;
        }),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carbs Consumption History</Text>
      {carbsGraphData.datasets[0].data.length > 0 ? (
        <LineChart
          data={carbsGraphData}
          width={screenWidth * 0.65}
          height={220}
          chartConfig={chartConfig}
          style={{ alignSelf: "center" }}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>No data available</Text>
      )}

      <Text style={styles.title}>Insulin Dosage History</Text>
      {insulinGraphData.datasets[0].data.length > 0 ? (
        <BarChart
          data={insulinGraphData}
          width={screenWidth * 0.65}
          height={220}
          chartConfig={chartConfig}
          style={{ alignSelf: "center" }}
          showValuesOnTopOfBars={true}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  selectedItem: {
    backgroundColor: "#F2F2F2",
  },
  selectedDayContainer: {
    marginTop: 16,
  },
  selectedDayText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  clearButton: {
    marginTop: 16,
  },
});

export default Trends;
