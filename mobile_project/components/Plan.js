import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PlanAheadScreen from './PlanAhead.js'
import FindNowScreen from './FindNow.js'
import RecommendScreen from './Recommend.js'
const Drawer = createDrawerNavigator();


const Plan = () => {
    return(
        <Drawer.Navigator>
        <Drawer.Screen name="Plan Your Trip Ahead" component={PlanAheadScreen} />
        <Drawer.Screen name="Find Adventures Now" component={FindNowScreen} />
        <Drawer.Screen name="Recommend Where To Next" component={RecommendScreen} />
      
      </Drawer.Navigator>

    );
    

}



export default Plan;