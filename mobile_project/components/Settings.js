import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';



const SettingsScreen= () => {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings</Text>
    </View>

    );
    

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'blue',
        borderWidth: 4,
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

export default SettingsScreen;