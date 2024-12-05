import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from "react-native";
import { firebase } from "../config";
import { useDispatch } from "react-redux";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const dispatch = useDispatch();

  const loginUser = async () => {
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const { uid, email } = userCredential.user;
        const user = { uid, email };
        firebase.firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              const userData = doc.data();
              const isFirstTimeLogin = userData.isFirstTimeLogin || false;
              if (isFirstTimeLogin) {
                const userWithNewFlag = { ...user, isFirstTimeLogin };
                dispatch({ type: "Login", payload: userWithNewFlag }); // Dispatch Login event after successful sign-in

                // User is logging in for the first time, perform necessary actions
                firebase.firestore()
                  .collection("users")
                  .doc(uid)
                  .update({
                    isFirstTimeLogin: false,
                  }).then(() => {
                    // Perform necessary actions for first-time login
                    console.log("Else Part");
                  }).catch(error => console.log("Error updating isFirstTimeLogin field:", error));
              } else {
                const fetchUserData = async () => {
                  const user = firebase.auth().currentUser;
                  console.log("userData: ", user);
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
                      dispatch({
                        type: "userData",
                        payload: { userData },
                      });
                    } else {
                      console.log("User data not found.");
                    }

                    if (userProf.exists) {
                      const userProfData = userProf.data();
                      dispatch({
                        type: "userProfileData",
                        payload: { userProfData },
                      });
                    } else {
                      console.log("User Prof data data not found.");
                    }
                  } else {
                    console.log("No user is currently logged in.");
                  }
                };

                fetchUserData();
                const userWithNewFlag = { ...user, isFirstTimeLogin };
                dispatch({ type: "Login", payload: userWithNewFlag }); // Dispatch Login event after successful sign-in
              }
            }
          })
          .catch(error => console.log("Error retrieving user document:", error));
      })
      .catch(error => {
        if (error.code === "auth/user-not-found") {
          alert("User not found. Please check your email and password.");
        } else if (error.code === "auth/wrong-password") {
          alert("Invalid password. Please try again.");
        } else if (error.code === "auth/user-disabled") {
          alert("Your account has been disabled. Please contact support.");
        } else if (error.code === "auth/user-mismatch") {
          alert(
            "There is a mismatch between the current user and the provided credentials."
          );
        } else {
          // Handle generic error case
          alert(`An error occurred during login. Please try again later: ${error}`);
        }
      });
  };

  const registerUser = async () => {
    console.log(
      "Attempting to register with: ",
      email,
      password,
      firstName,
      lastName
    );
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;

      if (currentUser) {
        await currentUser.sendEmailVerification({
          handleCodeInApp: true,
          url: "https://diabetes-app-4bd19.firebaseapp.com",
        });

        await firebase.firestore().collection("users").doc(currentUser.uid).set({
          firstName,
          lastName,
          email,
          isFirstTimeLogin: true,
        });

        alert("Email Verification sent. Please check your Spam Folder.");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Registration error: ", error);
      Alert.alert("Registration Error: ", error.message);
    }
  };

  const forgetPassword = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent");
      }).catch(err => {
        // Handle specific error cases

        if (err.code === "auth/user-not-found") {
          alert("User not found. Please check your email address.");
        } else {
          alert(err.message); // Display the generic error message
        }
      });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp); // Toggle between login and sign up views
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.splitScreenContainer}>
        <View style={styles.leftContainer}>
          {!isSignUp && (
            <View style={styles.form}>
              <Text style={styles.title}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button title="Login" onPress={loginUser} color="#6f61b8" />
              <View style={{ marginTop: 20 }}>
                <Button title="Go to Sign Up" onPress={toggleForm} color="#c7beec" />
              </View>
              <Text style={{ marginTop: 20 }} onPress={forgetPassword}>
                Forgot Password?
              </Text>
            </View>
          )}
          {isSignUp && (
            <View style={styles.form}>
              <Text style={styles.title}>Sign Up</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button title="Sign Up" onPress={registerUser} color="#6f61b8" />
              <View style={{ marginTop: 20 }}>
                <Button title="Go to Login" onPress={toggleForm} color="#c7beec" />
              </View>
            </View>
          )}
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmc1cHhobWZ1YTZzNDExMXl2d3cwcmNvaWtweWJja3VtcTAxcDJpYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zMQve1zBszJ3Uqsbi2/giphy.webp' }}
              style={styles.image}
            />
            <View style={styles.quoteContainer}>
              <Text style={styles.quote}>"People with high blood pressure, diabetes - those are conditions brought about by life style. If you change the life style, those conditions will leave."</Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5f7",
  },
  splitScreenContainer: {
    flexDirection: "row",
    flex: 1,
  },
  leftContainer: {
    width: Dimensions.get("window").width / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    width: Dimensions.get("window").width / 2,
    backgroundColor: "#6f61b8", // Solid color for the right side
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: Dimensions.get("window").width / 3,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6f61b8",
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  quoteContainer: {
    padding: 10,
    alignItems: 'center',
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default AuthScreen;