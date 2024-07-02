import React, {useState} from 'react';
import {StyleSheet, ImageBackground, Pressable, Text, View, TextInput, Button, Image} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './Settings.js';
import ProfileScreen from './Profile.js';
import ScrapBookScreen from './ScrapBook.js';
import CaptureScreen from './Capture.js';
import {Feather, MaterialIcons, FontAwesome} from '@expo/vector-icons';
import {useValue} from './ValueContext';

function HomeScreen({ navigation }) {
    const {currentValue} = useValue();
    return (
        <View style ={styles.containerPrime}>
        <ImageBackground source={require('./assets/images/background.jpg')} style ={{flex:1}} >

        <View style={styles.containerTop}>
        
        <Pressable
                  
                  onPress={() => navigation.navigate('Settings', {SettingsScreen})} >
                     <Feather name="settings" size={35} color="white" />
        </Pressable>
        
        <Pressable
                  
                  onPress={() => navigation.navigate('Profile', {ProfileScreen})} >
                     <MaterialIcons name="account-circle" size={35} color="white" />
        </Pressable>
   
       
        </View>
        <View style={styles.container}>
            <Text style={{fontSize: 30, color: 'white', fontWeight:"bold"}}>AdventureAdvisor</Text>
          <Image source={require('./assets/images/earth.jpg')} style = {styles.image} />
          <Text style={{fontSize: 20, color: 'white', fontWeight:"bold"}}>Welcome {currentValue['username']}!</Text>
          
      </View>
      <View style ={styles.container1}>
      <Pressable
                 
                  style ={styles.press}
                  onPress={() => navigation.navigate('ScrapBook', {ScrapBookScreen})} >
                     <FontAwesome name="photo" size={30} color="white" />
                     <Text style={{color:'white', marginLeft: 10}}>My ScrapBook</Text>
        </Pressable>
      
        <Pressable
                  
                  style ={styles.press}
                  onPress={() => navigation.navigate('Capture', {CaptureScreen})} >
                     <MaterialIcons name="add-a-photo" size={30} color="white"  />
                     <Text style={{color:'white', marginLeft: 10}}>Capture Your Adventure</Text>
        </Pressable>  
  
      </View>
      </ImageBackground>
      </View>
    );
  }
const Stack = createNativeStackNavigator();
const Home = () => {
    return(
  
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="ScrapBook" component={ScrapBookScreen} />
        
      </Stack.Navigator>
         

    );  

}

const styles = StyleSheet.create({
    image:{
        borderRadius: '100%',
        height: 200,
        width: 200,
        borderWidth: 10,
        borderColor: 'lightgrey',
        

        

    },
    press:{
        backgroundColor: 'royalblue', 
        width: 300, 
        height: 50,
        borderRadius:10, 
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        

        

    },
    containerPrime:{
        flexDirection: 'column',
        justifyContent: 'space-evenly',
  
        flex:1,
        backgroundColor: 'black'
    },
    container: {
        flex: 4, 
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        alignContent: 'flex-end',
        
    
    },
    container1: {
        flex: 2, 
        justifyContent: 'space-evenly', 
        alignItems: 'center'

    
    },
    containerTop: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        
        flexWrap: 'wrap',
        padding: 30

        
    
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderColor:'blue',
        borderWidth: 1,
    },
    text2:{
        fontSize: 25

    },
    button:{
        alignItems: 'center',
        backgroundColor: '#2196F3',
        padding: 10,
        color: 'white',
        borderRadius: 2,
        width: 250,
        height: 50,
        fontSize: 20
       
    }
});

export default Home;