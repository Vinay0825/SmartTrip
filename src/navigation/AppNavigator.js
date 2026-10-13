
import React from "react";

import { Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SavedScreen from "../screens/SavedScreen";
import HomeScreen from "../screens/HomeScreen";
import TripsScreen from "../screens/TripsScreen";
import ExploreScreen from "../screens/ExploreScreen";
import ProfileScreen from "../screens/ProfileScreen";

import CreateTripScreen from "../screens/CreateTripScreen";
import TripDetailsScreen from "../screens/TripDetailsScreen";
import PlaceDetailsScreen from "../screens/PlaceDetailsScreen";
import AddReviewScreen from "../screens/AddReviewScreen";
import MapScreen from "../screens/MapScreen";

import COLORS from "../constants/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          height: 65,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />

      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{ tabBarLabel: "My Trips" }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarLabel: "Explore" }}
      />

      <Tab.Screen
  name="Saved"
  component={SavedScreen}
  options={{
    tabBarLabel: "Saved",
    tabBarIcon: ({ color, size }) => (
      <Text style={{ color, fontSize: size }}>♥</Text>
    ),
  }}
/>

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />

        <Stack.Screen
          name="CreateTrip"
          component={CreateTripScreen}
        />

        <Stack.Screen
          name="TripDetails"
          component={TripDetailsScreen}
        />

        <Stack.Screen
          name="PlaceDetails"
          component={PlaceDetailsScreen}
        />

        <Stack.Screen
          name="AddReview"
          component={AddReviewScreen}
        />

        <Stack.Screen
          name="Map"
          component={MapScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
