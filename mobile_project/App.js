import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RootScreen from './components/Home.js';
import AboutScreen from './components/About.js';
import PlanScreen from './components/Plan.js';
import MyTripsScreen from './components/MyTrips.js';
import ValueProvider from './components/ValueContext';
import Ionicons from 'react-native-vector-icons/Ionicons';



const Tab = createBottomTabNavigator();

const data = {username:'', trips:[], completed:[]};

export default function App() {
  return (
    <ValueProvider value={data}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          
          tabBarActiveTintColor: 'blue',

          
         
          
        })}
      >
      <Tab.Screen name="Root" component={RootScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="Find an Adventure" component={PlanScreen} />
        <Tab.Screen name="MyTrips" component={MyTripsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    <StatusBar style="dark" />
    </ValueProvider>
  );
}