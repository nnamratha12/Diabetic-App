import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button, Title, Text } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { firebase } from "../../config";
import { TimePickerModal } from "react-native-paper-dates";
import DropDown from 'react-native-paper-dropdown';


const GetUserDetails = ({ navigation }) => {
  const userState = useSelector(state => state.user);

  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [showFtDropDown, setShowFtDropDown] = useState(false);
  const [showInDropDown, setShowInDropDown] = useState(false);
  const [age, setAge] = useState("");
  const [bloodGlucoseRange, setBloodGlucoseRange] = useState("");
  const [targetBloodGlucose, setTargetBloodGlucose] = useState("");
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

  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [visibleBFS, setVisibleBFS] = useState(false);
  const [visibleBFE, setVisibleBFE] = useState(false);

  const [visibleLHS, setVisibleLHS] = useState(false);
  const [visibleLHE, setVisibleLHE] = useState(false);

  const [visibleDNS, setVisibleDNS] = useState(false);
  const [visibleDNE, setVisibleDNE] = useState(false);

  const onDismiss = React.useCallback(() => {
    setVisibleBFS(false);
    setVisibleLHS(false);
    setVisibleDNS(false);
    setVisibleBFE(false);
    setVisibleLHE(false);
    setVisibleDNE(false);
  }, [
    setVisibleBFS,
    setVisibleLHS,
    setVisibleDNS,
    setVisibleBFE,
    setVisibleLHE,
    setVisibleDNE,
  ]);

  const feetList = [
    {
      label: "4",
      value: "4",
    },
    {
      label: "5",
      value: "5",
    },
    {
      label: "6",
      value: "6",
    },
    {
      label: "7",
      value: "7",
    },
  ];

  const InchesList = [
    {
      label: '0',
      value: '0',
    },
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
    {
      label: '6',
      value: '6',
    },
    {
      label: '7',
      value: '7',
    },
    {
      label: '8',
      value: '8',
    },
    {
      label: '9',
      value: '9',
    },
    {
      label: '10',
      value: '10',
    },
    {
      label: '11',
      value: '11',
    },
  ];

  const getMealAndTime = ({ hours, minutes }) => {
    console.log("Confirm Meal: ", selectedMeal, selectedTime, hours, minutes);
    if (selectedMeal === "BF" && selectedTime === "start") {
      console.log("Into BF STAR");
      setBreakfastStartHour({ hours, minutes });
    } else if (selectedMeal === "BF" && selectedTime === "End") {
      setBreakfastEndHour({ hours, minutes });
    } else if (selectedMeal === "LH" && selectedTime === "start") {
      setLunchStartHour({ hours, minutes });
    } else if (selectedMeal === "LH" && selectedTime === "End") {
      setLunchEndHour({ hours, minutes });
    } else if (selectedMeal === "DN" && selectedTime === "start") {
      setDinnerStartHour({ hours, minutes });
    } else if (selectedMeal === "DN" && selectedTime === "End") {
      setDinnerEndHour({ hours, minutes });
    }
  };

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      if (selectedMeal === "BF" && selectedTime === "start") {
        setVisibleBFS(false);
      } else if (selectedMeal === "BF" && selectedTime === "End") {
        setVisibleBFE(false);
      } else if (selectedMeal === "LH" && selectedTime === "start") {
        setVisibleLHS(false);
      } else if (selectedMeal === "LH" && selectedTime === "End") {
        setVisibleLHE(false);
      } else if (selectedMeal === "DN" && selectedTime === "start") {
        setVisibleDNS(false);
      } else if (selectedMeal === "DN" && selectedTime === "End") {
        setVisibleDNE(false);
      }
      console.log("Yo: ", selectedMeal);
      getMealAndTime({ hours, minutes });

      console.log({ hours, minutes });
    },
    [selectedMeal, selectedTime]
  );

  const handlePickerOpen = (e, v) => {
    console.log("Handle Open: ", e, v);
    setSelectedMeal(e);
    setSelectedTime(v);
    if (e === "BF" && v === "start") {
      setVisibleBFS(true);
    } else if (e === "BF" && v === "End") {
      setVisibleBFE(true);
    } else if (e === "LH" && v === "start") {
      setVisibleLHS(true);
    } else if (e === "LH" && v === "End") {
      setVisibleLHE(true);
    } else if (e === "DN" && v === "start") {
      setVisibleDNS(true);
    } else if (e === "DN" && v === "End") {
      setVisibleDNE(true);
    }
  };
  console.log("Select Meal: ", selectedMeal, selectedTime);

  const dispatch = useDispatch();

  useEffect(() => { }, []);

  const [next, setNext] = useState(false);
  const handleNext = () => {
    console.log("Next");
    setNext(!next);
  };

  const handleSubmit = async () => {
    if (!isFullDayCovered()) {
      alert("Please ensure that breakfast, lunch, and dinner times cover the entire 24-hour cycle.");
      return;
    }
    try {
      const user = firebase.auth().currentUser;

      if (user) {
        const userId = user.uid;
        const userDocRef = firebase.firestore()
          .collection("userProfile")
          .doc(userId);

        const data = {
          weight,
          heightFt,
          heightIn,
          age,
          bloodGlucoseRange,
          targetBloodGlucose,
          breakfastStartHour,
          breakfastEndHour,
          lunchStartHour,
          lunchEndHour,
          dinnerStartHour,
          dinnerEndHour,
          bfICR,
          lhICR,
          mICR,
          crr,
        };

        await userDocRef.set(data, { merge: true });
        dispatch({
          type: "UpdateUserFlag",
          payload: { ...userState, isFirstTimeLogin: false },
        });
        console.log("Data saved successfully.\n", data);
        alert("Updated successfully");
      } else {
        console.log("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  // Calculate the total duration of breakfast, lunch, and dinner
  const calculateDuration = (start, end) => {
    const startMinutes = start.hours * 60 + start.minutes;
    const endMinutes = end.hours * 60 + end.minutes;
    return endMinutes >= startMinutes ? endMinutes - startMinutes : 1440 - startMinutes + endMinutes;
  };

  // Check if full day is covered or not
  const isFullDayCovered = () => {
    const breakfastDuration = calculateDuration(breakfastStartHour, breakfastEndHour);
    const lunchDuration = calculateDuration(lunchStartHour, lunchEndHour);
    const dinnerDuration = calculateDuration(dinnerStartHour, dinnerEndHour);
    const totalDuration = breakfastDuration + lunchDuration + dinnerDuration;
    return totalDuration >= 1437;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        {next ? (
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Enter Breakfast ICR"
              value={bfICR}
              style={styles.input}
              onChangeText={e => setBfICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Lunch ICR"
              value={lhICR}
              style={styles.input}
              onChangeText={e => setLhICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Dinner ICR"
              value={mICR}
              style={styles.input}
              onChangeText={e => setMICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Correction Ratio"
              value={crr}
              style={styles.input}
              onChangeText={e => setCRR(e)}
              keyboardType="numeric"
            />
            <Button mode="contained" style={styles.button} onPress={handleNext}>
              Back
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit}
              disabled={!bfICR || !lhICR || !mICR || !crr}
            >
              Submit
            </Button>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Title style={styles.title}>
              Please Fill Out Below Information First
            </Title>
            <TextInput
              placeholder="Enter Weight (lbs)"
              value={weight}
              style={styles.input}
              onChangeText={e => setWeight(e)}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Enter Height</Text>
            <View style={styles.heightInput}>
              <DropDown
                label={"Feet"}
                mode={"outlined"}
                visible={showFtDropDown}
                showDropDown={() => setShowFtDropDown(true)}
                onDismiss={() => setShowFtDropDown(false)}
                value={heightFt}
                setValue={setHeightFt}
                list={feetList}
              />

              <DropDown
                label={"Inches"}
                mode={"outlined"}
                visible={showInDropDown}
                onDismiss={() => setShowInDropDown(false)}
                showDropDown={() => setShowInDropDown(true)}
                value={heightIn}
                setValue={setHeightIn}
                list={InchesList}
              />
            </View>
            <TextInput
              placeholder="Enter Age"
              value={age}
              style={styles.input}
              onChangeText={e => setAge(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter your blood glucose range (a-b) (in mmol/l)"
              value={bloodGlucoseRange}
              style={styles.input}
              onChangeText={e => setBloodGlucoseRange(e)}
              keyboardType="text"
            />
            <TextInput
              placeholder="Enter your target blood glucose (in mmol/l)"
              value={targetBloodGlucose}
              style={styles.input}
              onChangeText={e => setTargetBloodGlucose(e)}
              keyboardType="numeric"
            />
            <View style={styles.hoursContainer}>
              <View style={styles.hoursRow}>
                <View
                  style={{
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                  }}
                ></View>
                <Button
                  onPress={() => handlePickerOpen("BF", "start")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Breakfast Start Hour
                </Button>
                <TimePickerModal
                  visible={visibleBFS}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={breakfastStartHour.hours}
                  minutes={breakfastStartHour.minutes}
                  use24HourClock="true"
                />
                <Button
                  onPress={() => handlePickerOpen("BF", "End")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Breakfast End Hour
                </Button>
                <TimePickerModal
                  visible={visibleBFE}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={breakfastEndHour.hours}
                  minutes={breakfastEndHour.minutes}
                  use24HourClock="true"
                />
              </View>
              <View style={styles.hoursRow}>
                <Button
                  onPress={() => handlePickerOpen("LH", "start")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Lunch Start Hour
                </Button>
                <TimePickerModal
                  visible={visibleLHS}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={lunchStartHour.hours}
                  minutes={lunchStartHour.minutes}
                  use24HourClock="true"
                />
                <Button
                  onPress={() => handlePickerOpen("LH", "End")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Lunch End Hour
                </Button>
                <TimePickerModal
                  visible={visibleLHE}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={lunchEndHour.hours}
                  minutes={lunchEndHour.minutes}
                  use24HourClock="true"
                />
              </View>
              <View style={styles.hoursRow}>
                <Button
                  onPress={() => handlePickerOpen("DN", "start")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Dinner Start Hour
                </Button>
                <TimePickerModal
                  visible={visibleDNS}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={dinnerStartHour.hours}
                  minutes={lunchEndHour.minutes}
                  use24HourClock="true"
                />
                <Button
                  onPress={() => handlePickerOpen("DN", "End")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Dinner End Hour
                </Button>
                <TimePickerModal
                  visible={visibleDNE}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={dinnerEndHour.hours}
                  minutes={dinnerEndHour.minutes}
                  use24HourClock="true"
                />
              </View>
            </View>

            <Button
              mode="contained"
              style={styles.button}
              onPress={handleNext}
              disabled={
                !weight ||
                !heightFt ||
                !heightIn ||
                !age ||
                !bloodGlucoseRange ||
                !targetBloodGlucose ||
                !breakfastStartHour ||
                !breakfastEndHour ||
                !lunchStartHour ||
                !lunchEndHour ||
                !dinnerStartHour ||
                !dinnerEndHour
              }
            >
              Next
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  heightInput: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  picker: {
    width: "35%",
    height: 50,
    backgroundColor: "#dee3eb",
    borderRadius: 6,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    color: "#a6e4d0",
  },
  buttonContaier: {
    paddingTop: 10,
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  subheading: {
    fontSize: 15,
    marginBottom: 32,
  },
  hoursContainer: {
    width: "100%",
  },
  hoursRow: {
    flexDirection: "row",
  },
  halfWidthInput: {
    width: "49%",
    marginBottom: 10,
    marginEnd: 10,
  },
});

export default GetUserDetails;
