import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PlanAheadScreen from './PlanAhead.js'
import FindNowScreen from './FindNow.js'
const Drawer = createDrawerNavigator();


const Plan = () => {
    return(
        <Drawer.Navigator>
        <Drawer.Screen name="Find Adventures Now" component={FindNowScreen} />
        <Drawer.Screen name="Plan Your Trip Ahead" component={PlanAheadScreen} />
      
      </Drawer.Navigator>

    );
    

}



export default Plan;