import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable,Button,FlatList, TextInput,Alert } from 'react-native';
import {useValue} from './ValueContext';
import { MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tripPageScreen from './TripPage'
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from './ImageViewer';


const PlaceholderImage = require('./assets/images/default.webp');

const Stack = createNativeStackNavigator();
let name = "";


function ScrapBookHome({navigation}){
    const {currentValue, setCurrentValue} = useValue();
    const [selectedImage, setSelectedImage] = useState(null);

    
    const renderTrip = ({ item, index }) => {
       
        
        return (
            
            <View style={styles.container}>
                <Pressable onPress ={() => {name = `${item.destination} ${item.startDate.substring(0,4)}`; navigation.navigate('TripPage',  {index})}}>
                <View style={styles.header}>
                    
                    <View style ={{flexDirection: 'column'}}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.destination}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.startDate.substring(0,4)}</Text>
                    <View style ={styles.imageContainer}>
                        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={item.photos[0]} />

                    </View>
                    
                    </View>
                    
                   

                </View>
                </Pressable>
                
                
            </View>
        );
    };

    return(
        <SafeAreaView style={styles.containerPrime}>

            
            
                
                <FlatList
                    data={currentValue['completed']}
                    renderItem={renderTrip}
                    keyExtractor={(item, index) => index.toString()} 
                    numColumns={2}// Use index as key for simplicity
                    columnWrapperStyle={styles.row}
                />
         
        </SafeAreaView>

    );
    

}
const ScrapBookNav = () => {

    return (
        
    
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="ScrapBook" component={ScrapBookHome} options={{ headerShown: false }}  />
          <Stack.Screen name="TripPage" component={tripPageScreen}    options={{ title: name }}/>
          
         
        </Stack.Navigator>

    );
};

const styles = StyleSheet.create({
    containerPrime: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        
        margin: 20,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        padding: 20,
        
        

    },
    imageContainer:{
        flex: 1,
        paddingTop: 10,
       

    },
    header:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },
});

export default ScrapBookNav;
