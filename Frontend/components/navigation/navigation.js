import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, } from "@react-navigation/drawer";
import { LightTheme } from "../../utils/theme";
import AuthScreen from "../../pages/loginScreen";
import { firebase } from "../../config";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileScreen from "../../pages/profileScreen";
import HistoryScreen from "../../pages/HistoryScreen";
import HomeNavigation from "./homeNavigation";
import GetUserDetails from "../../pages/onBoarding/getUserDetails";
import Trends from "../../pages/trends";

const Drawer = createDrawerNavigator();

export default function NavigationStack() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userState = useSelector(state => state.user);

  function onAuthStateChanged(user) {
    setUser(user);
    if (isLoading) setIsLoading(false);
  }

  useEffect(() => firebase.auth().onAuthStateChanged(onAuthStateChanged), [userState]);

  if (isLoading) {
    // Show a loading spinner or splash screen while checking the user's authentication status
    return null;
  }

  const CustomDrawerContent = props => (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => firebase.auth().signOut()}
      />
    </DrawerContentScrollView>
  );

  return (
    <>
      <NavigationContainer theme={LightTheme}>
        {user && user?.emailVerified ? (
          <>
            {userState?.user?.isFirstTimeLogin ? (
              <Drawer.Navigator>
                <Drawer.Screen name="userInfo" component={GetUserDetails} />
              </Drawer.Navigator>
            ) : (
              <Drawer.Navigator
                initialRouteName={"Home"}
                drawerContent={props => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen
                  name="Home"
                  component={HomeNavigation}
                  options={{
                    headerShown: false,
                  }}
                />
                <Drawer.Screen name="History" component={HistoryScreen} />
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Trends" component={Trends} />
              </Drawer.Navigator>
            )}
          </>
        ) : (
          <Drawer.Navigator>
            <Drawer.Screen name="Login" component={AuthScreen} />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </>
  );
}
