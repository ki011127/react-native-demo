import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Exercise from './screens/Exercise';
import HomeScreen from './screens/HomeScreen';
import CalendarPage from './screens/CalendarPage';
import Timer from './screens/Timer';
import BLE from './screens/BLE';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={HomeScreen} />
        <Stack.Screen name="Exercise" component={Exercise} />
        <Stack.Screen name="Calendar" component={CalendarPage}/>
        <Stack.Screen name="Timer" component={Timer}/>
        <Stack.Screen name="BLE" component={BLE}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}