import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
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
import AddCarbsModal from "../ui/addCarbsModal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EditFoodItem } from "../redux/actions/actionTypes";

const EditFood = ({ navigation, route }) => {
  const { item } = route.params;
  const dispatch = useDispatch();
  const addFood = useSelector(state => state.addFood);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodDetails, setFoodDetails] = useState(item);
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
    if (foodDetails) {
      let carbs = foodDetails?.foodNutrients?.find(x => parseInt(x.number) === 205);
      setCarbs(carbs?.amount?.toFixed(2));
      setTotalCarbs(carbs?.amount?.toFixed(2));
      setCarbUnit(carbs.unitName);
    }
  }, [foodDetails]);

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
  console.log("userrrrrrr", addFood)

  const updateFood = (updatedItem, count) => {
    showSnackBar();
    console.log("Item to update details: ", updatedItem)
    setTimeout(() => {
      dispatch(EditFoodItem({ count, fdcId: item?.fdcId }));
      // add api call here
      navigation.goBack();
    }, 1000);
  };

  const handleSaveCarbs = carbs => {
    setModalVisible(false);
    let currentData = foodDetails?.foodNutrients?.find(x => parseInt(x.number) === 205);
    let newData = { ...currentData, amount: Number(carbs) };
    let newArray = foodDetails?.foodNutrients.map(item => parseInt(item.number) === 205 ? newData : item);
    let newFoodDetails = { ...foodDetails, foodNutrients: newArray };
    setFoodDetails(newFoodDetails);
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
      Item updated successfully!
    </Snackbar>
  );

  const handleChange = count => setServingCount(count);

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {foodDetails?.fdcId ? (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{foodDetails.description}</Title>
              {foodDetails?.foodNutrients?.map(item => (
                <View key={item?.number}>
                  <Paragraph>
                    {item.name} : {item.amount}
                    {item.unitName}
                  </Paragraph>
                </View>
              ))}
              <View style={styles.servingContainer}>
                <Text variant="titleMedium">Number of Servings (100g/serving): </Text>
                <IconButton
                  icon="minus-circle-outline"
                  size={30}
                  onPress={decrementServingCount}
                />
                <TextInput
                  style={styles.servingCount}
                  value={servingCount.toString()}
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
                Edit Carbs Manually?
              </Button>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => updateFood(foodDetails, servingCount)}
              >
                Update Food
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
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditFood;

const styles = StyleSheet.create({
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
  servingCount: {
    width: 60,
    textAlign: "center",
  },
});
