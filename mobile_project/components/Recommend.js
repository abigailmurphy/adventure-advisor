import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';

const Recommend = () => {
    return(
        <Text>Recommend!</Text>

    );
    

}

const styles = StyleSheet.create({
    image:{
        borderRadius: '50%',
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
        padding: 20,
        

    },
    containerPrime:{
        justifyContent: 'center',
        padding: 20,
        flex:1,
        backgroundColor: 'black'
    },
    container: {
        flex: 1, 
        justifyContent: 'space-evenly', 
        alignItems: 'center',
       
    
    },
});

export default Recommend;