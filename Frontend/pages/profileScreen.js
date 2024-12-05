import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button, Title, Subheading, Text, Card } from "react-native-paper";
import DropDown from 'react-native-paper-dropdown';
import { useDispatch } from "react-redux";
import { firebase } from "../config";
import { TimePickerModal } from "react-native-paper-dates";
import { useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ProfileScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [userStateData, setUserStateData] = useState({});
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
  const [dnICR, setDnICR] = useState("");
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
    if (selectedMeal === "BF" && selectedTime === "start") {
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
      getMealAndTime({ hours, minutes });
      onDismiss();
    },
    [selectedMeal, selectedTime]
  );

  const handlePickerOpen = (e, v) => {
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

  const dispatch = useDispatch();

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
            setBloodGlucoseRange(userProfData.bloodGlucoseRange);
            setTargetBloodGlucose(userProfData.targetBloodGlucose);
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

  const [next, setNext] = useState(false);
  const handleNext = () => {
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
        const userDocRef = firebase
          .firestore()
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
          dnICR,
          crr,
        };

        await userDocRef.set(data, { merge: true });
        alert("Updated successfully");
        navigation.navigate("Home");
      } else {
        console.log("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const calculateDuration = (start, end) => {
    const startMinutes = start.hours * 60 + start.minutes;
    const endMinutes = end.hours * 60 + end.minutes;
    return endMinutes >= startMinutes ? endMinutes - startMinutes : 1440 - startMinutes + endMinutes;
  };

  const isFullDayCovered = () => {
    const breakfastDuration = calculateDuration(breakfastStartHour, breakfastEndHour);
    const lunchDuration = calculateDuration(lunchStartHour, lunchEndHour);
    const dinnerDuration = calculateDuration(dinnerStartHour, dinnerEndHour);

    const totalDuration = breakfastDuration + lunchDuration + dinnerDuration;
    return totalDuration >= 1437;
  };

  const formatTime = time => {
    if (!time || time.hours === undefined || time.minutes === undefined) {
      return "--:--";
    }
    const hours = time.hours.toString().padStart(2, '0');
    const minutes = time.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
          {next ? (
            <View style={styles.formContainer}>
              <TextInput
                label="Enter Breakfast ICR"
                value={bfICR}
                style={styles.input}
                onChangeText={e => setBfICR(e)}
                keyboardType="numeric"
              />
              <TextInput
                label="Enter Lunch ICR"
                value={lhICR}
                style={styles.input}
                onChangeText={e => setLhICR(e)}
                keyboardType="numeric"
              />
              <TextInput
                label="Enter Dinner ICR"
                value={dnICR}
                style={styles.input}
                onChangeText={e => setDnICR(e)}
                keyboardType="numeric"
              />
              <TextInput
                label="Enter Correction Ratio"
                value={crr}
                style={styles.input}
                onChangeText={e => setCRR(e)}
                keyboardType="numeric"
              />
              <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContent}
                onPress={handleNext}
              >
                Back
              </Button>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={handleSubmit}
                  contentStyle={styles.buttonContent}
                  disabled={!bfICR || !lhICR || !dnICR || !crr}
                >
                  Submit
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Title style={styles.title}>{`${userStateData?.firstName} ${userStateData?.lastName}`}</Title>
              <Subheading style={styles.subheading}>
                {userStateData?.email}
              </Subheading>
              <TextInput
                label="Enter Weight (lbs)"
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <Text style={styles.label}>Enter Height</Text>
              <View style={styles.heightInput}>
                <View style={styles.feetInput}>
                  <DropDown
                    mode={"outlined"}
                    visible={showFtDropDown}
                    label={"Feet"}
                    showDropDown={() => setShowFtDropDown(true)}
                    onDismiss={() => setShowFtDropDown(false)}
                    value={heightFt}
                    setValue={setHeightFt}
                    list={feetList}
                  />
                </View>
                <View style={styles.inchesInput}>
                  <DropDown
                    mode={"outlined"}
                    visible={showInDropDown}
                    label={"Inches"}
                    onDismiss={() => setShowInDropDown(false)}
                    showDropDown={() => setShowInDropDown(true)}
                    value={heightIn}
                    setValue={setHeightIn}
                    list={InchesList}
                  />
                </View>
              </View>
              <TextInput
                label="Enter Age"
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
              <TextInput
                label="Enter your blood glucose range (a-b) (in mmol/L)"
                style={styles.input}
                value={bloodGlucoseRange}
                onChangeText={setBloodGlucoseRange}
                keyboardType="text"
              />
              <TextInput
                label="Enter your target blood glucose (in mmol/L)"
                value={targetBloodGlucose}
                style={styles.input}
                onChangeText={e => setTargetBloodGlucose(e)}
                keyboardType="numeric"
              />
              <View style={styles.hoursContainer}>
                <Card style={styles.timeCard}>
                  <Text style={styles.timeLabel}>Breakfast</Text>
                  <View style={styles.timeRow}>
                    <Button
                      onPress={() => handlePickerOpen("BF", "start")}
                      mode="outlined"
                      style={styles.timeButton}
                    >
                      {`Start: ${formatTime(breakfastStartHour)}`}
                    </Button>
                    <Button
                      onPress={() => handlePickerOpen("BF", "End")}
                      mode="outlined"
                      style={styles.timeButton}
                    >
                      {`End: ${formatTime(breakfastEndHour)}`}
                    </Button>
                  </View>
                </Card>
                <Card style={styles.timeCard}>
                  <Text style={styles.timeLabel}>Lunch</Text>
                  <View style={styles.timeRow}>
                    <Button
                      onPress={() => handlePickerOpen("LH", "start")}
                      mode="outlined"
                      style={styles.timeButton}
                    >
                      {`Start: ${formatTime(lunchStartHour)}`}
                    </Button>
                    <Button
                      onPress={() => handlePickerOpen("LH", "End")}
                      mode="outlined"
                      style={styles.timeButton}
                    >
                      {`End: ${formatTime(lunchEndHour)}`}
                    </Button>
                  </View>
                </Card>
                <Card style={styles.timeCard}>
                  <Text style={styles.timeLabel}>Dinner</Text>
                  <View style={styles.timeRow}>
                    <Button
                      onPress={() => handlePickerOpen("DN", "start")}
                      mode="outlined"
                      style={styles.timeButton}
                    >
                      {`Start: ${formatTime(dinnerStartHour)}`}
                    </Button>
                    <Button
                      onPress={() => handlePickerOpen("DN", "End")}
                      mode="outlined"
                      style={styles.timeButton}
                    >
                      {`End: ${formatTime(dinnerEndHour)}`}
                    </Button>
                  </View>
                </Card>
              </View>
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleNext}
                contentStyle={styles.buttonContent}
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
      <TimePickerModal
        visible={visibleBFS || visibleBFE || visibleLHS || visibleLHE || visibleDNS || visibleDNE}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={selectedMeal === "BF" ? (selectedTime === "start" ? breakfastStartHour.hours : breakfastEndHour.hours) :
          selectedMeal === "LH" ? (selectedTime === "start" ? lunchStartHour.hours : lunchEndHour.hours) :
            selectedMeal === "DN" ? (selectedTime === "start" ? dinnerStartHour.hours : dinnerEndHour.hours) : 0}
        minutes={selectedMeal === "BF" ? (selectedTime === "start" ? breakfastStartHour.minutes : breakfastEndHour.minutes) :
          selectedMeal === "LH" ? (selectedTime === "start" ? lunchStartHour.minutes : lunchEndHour.minutes) :
            selectedMeal === "DN" ? (selectedTime === "start" ? dinnerStartHour.minutes : dinnerEndHour.minutes) : 0}
        use24HourClock={true}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  heightInput: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  feetInput: {
    width: "49%",
  },
  inchesInput: {
    width: "49%",
  },
  picker: {
    backgroundColor: "#ffffff",
  },
  pickerItem: {
    color: "#000000",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333333",
  },
  button: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#2A6BBF',
    marginVertical: 10,
  },
  buttonContent: {
    height: 50,
    width: 340,
  },
  buttonContainer: {
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    color: '#2A6BBF',
  },
  subheading: {
    fontSize: 15,
    marginBottom: 32,
    color: '#666666',
  },
  hoursContainer: {
    width: "100%",
  },
  timeCard: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#2A6BBF',
    marginBottom: 5,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeButton: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A6BBF',
  },
  halfWidthInput: {
    width: "49%",
    marginBottom: 10,
  },
});

export default ProfileScreen;
