import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/Home.js';
import AboutScreen from './components/About.js';
import PlanScreen from './components/Plan.js';




const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="Find an Adventure" component={PlanScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}