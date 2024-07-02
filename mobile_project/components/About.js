import React, {useState} from 'react';
import {StyleSheet, ImageBackground, Text, View, TextInput, Button} from 'react-native';



const About = () => {
    return(
        <View style ={styles.containerPrime}>
        <ImageBackground source={require('./assets/images/background.jpg')} style ={{flex:1}} >

        <View style={styles.container}>
            <Text style={{fontSize: 35, color: 'white', fontWeight:"bold"}}>About AdventureAdvisor</Text>
            <Text style={{fontSize: 20, color: 'white', fontWeight:"bold"}}>Chart Your Course</Text>
            <Text style={{fontSize: 15, color: 'white', fontWeight:"bold"}}>
                While planning a trip anywhere can be overwhelming, AdventureAdvisor has got you covered.
                Plan short term with your current location or well in advance over multiple days with AI, entering
                popular parameters and keywords to tailor a trip that is perfect for you. Your input will be spliced into 
                a prompt and sent to AI that will do the rest. Can't decide where to travel next? Feeling beachy but not sure where to go?
                Want a romantic vibe to spend for someone special? Looking for your next hike with a vista? 
                Your advisor can also recommend new places for you to go. 
            </Text>

            <Text style={{fontSize: 20, color: 'white', fontWeight:"bold"}}>Document Your Trips</Text>

            <Text style={{fontSize: 15, color: 'white', fontWeight:"bold"}}>
            The Real Adventure is the Journey, Not the Destination Never lose your 
            trips in your camera roll and never forget each step you took along the way! You may also select
            from your camera roll to add to the digital album.
         
            </Text>

          
      </View>
      </ImageBackground>
      
      </View>

    );
    

}

const styles = StyleSheet.create({
    image:{
        borderRadius: '50%',
        height: 275,
        width: 275,
        borderWidth: 10,
        borderColor: 'lightgrey', 

    },
    containerPrime:{
        justifyContent: 'center',
        padding: 20,
        flex:1,
        backgroundColor: 'black'
    },
    container: {
        flex: 4, 
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        alignContent: 'flex-end',
        flexWrap: 'wrap',
        margin: 20

        
    
    },
  
   
});

export default About;