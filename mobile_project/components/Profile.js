import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import {useValue} from './ValueContext';



const ProfileScreen= () => {
    const {currentValue,setCurrentValue} = useValue();
    return(
        <View style={styles.container}>

        <View style={styles.container}>
        <Text style ={{fontWeight:'bold', fontSize: 25}}>Profile</Text>
        </View>

        <View style={{...styles.container, flex: 2} }>
        <Text style ={{fontWeight:'bold', fontSize: 15}}>Username: {currentValue['username']}</Text>
        <TextInput style={{height: 40,backgroundColor:'white'}}
            placeholder="Enter username"
            onChangeText={(text) => {
                setCurrentValue({...currentValue, username: text});
            }}
        />
        
        </View>

        <View style={{...styles.container, flex: 2} }>
        <Text style ={{fontWeight:'bold', fontSize: 15}}>Password: {currentValue['password']}</Text>
        <TextInput style={{height: 40,backgroundColor:'white'}}
            placeholder="Enter password"
            onChangeText={(text) => {
                setCurrentValue({...currentValue, password: text});
            }}
        />
        </View>
        
    

        
      </View>

    );
    

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    
        backgroundColor: 'lightgray',
        margin: 50
    
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

export default ProfileScreen;