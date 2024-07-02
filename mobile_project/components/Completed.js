import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable,Button,FlatList, TextInput,Alert } from 'react-native';
import {useValue} from './ValueContext';
import { MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';



const Completed = () => {
    const {currentValue, setCurrentValue} = useValue();
    const [editedPlans, setEditedPlans] = useState({});

    const [expandedItems, setExpandedItems] = useState({});
    const [editItems, setEditItems] = useState({});
    

    const deleteTrip = (index) => {
        const newTrips = currentValue.completed.filter((_, i) => i !== index);
        setCurrentValue({ ...currentValue, completed: newTrips });
    };

    const toggleExpand = (index) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };
    const toggleEdit = (index) => {
        setEditItems(prevState => ({
            ...prevState,
            [index]: !prevState[index]

        }));

        if (!editItems[index]) {
            setEditedPlans(prevState => ({
                ...prevState,
                [index]: currentValue.completed[index].plan.trim()
            }));
        }

    };
    const handleInputChange = (text, index) => {
        setEditedPlans(prevState => ({
            ...prevState,
            [index]: text,
        }));
    };
   
    const moveToTrips = (index, item) => {
        
        const newTrip = currentValue['trips'].concat(
            {
                'plan': item.plan,
                'prompt': item.prompt,
                'destination': item.destination,
                'startDate': item.startDate,
                'endDate': item.endDate,
            },
        );
        const updatedCompleted = currentValue.completed.filter((_, i) => i !== index);
        
        setCurrentValue({ ...currentValue, trips: newTrip, completed: updatedCompleted });
        
        
    };
    const saveChanges = (index) => {
        // Apply changes to the plan
        const updatedPlan = editedPlans[index];
        
        // Update the currentValue with the updated plan
        const updatedTrips = [...currentValue.completed];
        updatedTrips[index] = { ...updatedTrips[index], plan: updatedPlan };
        setCurrentValue({ ...currentValue, completed: updatedTrips });

        // Toggle edit mode off
        toggleEdit(index);
    };
  
    const renderTrip = ({ item, index }) => {
        const isExpanded = expandedItems[index];
        const editMode = editItems[index];
        
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable
                                title = {editMode ? "Collapse" : "Expand"}
                                onPress={() => moveToTrips(index, item)} >
                                <MaterialCommunityIcons name="airplane-check" size={30} color="green" />
                    </Pressable>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.destination}</Text>
                    
                    <Pressable
                        title = {isExpanded ? "Collapse" : "Expand"}
                        onPress={() => toggleExpand(index)} >
        
                        <Text style={{color:'white', margin:20,fontSize:'15'}}>{isExpanded ? <MaterialIcons name="expand-less" size={24} color="black" /> : <MaterialIcons name="expand-more" size={24} color="black" />}</Text>
                    </Pressable>
                   

                </View>
                
                {isExpanded && (
                    <>
                    {!editMode ? (
                        <>
                        <View style ={{flexDirection:'row', padding:10, justifyContent: "flex-end"}}>
                            
                        
                            <Pressable
                                title = {editMode ? "Collapse" : "Expand"}
                                onPress={() => toggleEdit(index)} >
                                <MaterialIcons name="edit" size={24} color="black" />
                            </Pressable>
                        </View>
                        
                        <Text>{item.plan}</Text>
                        </>
                    ) : (
                        <>
                        
                        <Button title='Save Changes' onPress={() => saveChanges(index)} />
                        
                       <View style = {{padding: 10}}>
                        <TextInput
                            key={index}
                            placeholder={`${index + 1}`}
                            style={{backgroundColor: 'white', height: 250, padding: 20, borderRadius: 10}}
                            defaultValue={`${item.plan.trim()}`}
                            multiline = {true}
                            onChangeText={(text) => handleInputChange(text, index)}
                        />
                        </View>
                        <Pressable style ={{marginTop:30, alignSelf:'center'}} onPress={() => deleteTrip(index)}>
                            <View style = {{flexDirection:'row', alignContent: 'center'}}>
                                <MaterialIcons name="delete" size={20} color="red" /> 
                                <Text style ={{fontSize: 20, color:'red'}}>Delete this Itinerary</Text>

                        </View>
                                
                        </Pressable>
                       

                        
                        
                        </>
                        )}
                    </>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.containerPrime}>

            <Button title ='clear' onPress ={ () => {setCurrentValue({...currentValue, trips: []})}}/>
            
                
                <FlatList
                    data={currentValue['completed']}
                    renderItem={renderTrip}
                    keyExtractor={(item, index) => index.toString()} // Use index as key for simplicity
                />
         
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    containerPrime: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        
        margin: 20,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        padding: 20,
        
        alignContent: 'stretch',

    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
});

export default Completed;
