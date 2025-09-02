import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FutureScreen from './FutureTrips.js';
import CompleteScreen from './Completed.js';

const Drawer = createDrawerNavigator();


const Plan = () => {
    return(
        <Drawer.Navigator>
        <Drawer.Screen name="My Itineraries" component={FutureScreen} />
        <Drawer.Screen name="Taken Trips" component={CompleteScreen} />
        
        
      
      </Drawer.Navigator>

    );
    

}



export default Plan;