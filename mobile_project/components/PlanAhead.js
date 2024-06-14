import React, {useState} from 'react';
import {StyleSheet,Text, View, TextInput, Button} from 'react-native';





const PlanAhead = () => {
    const [dest, setDest] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [startDay, setStartDay] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endDay, setEndDay] = useState('');
    const [endYear, setEndYear] = useState('');
    const [parameters, setParameters] = useState(false);
    const [prompt, setPrompt] = useState('');

    const handlePlanTrip = () => {
        const formattedStartDate = `${startMonth}/${startDay}/${startYear}`;
        const formattedEndDate = `${endMonth}/${endDay}/${endYear}`;
        const parameterText = parameters ? "with kids" : "without kids";
        const sentence = `Plan a trip to ${dest} between the dates ${formattedStartDate} and ${formattedEndDate}
        " " ${parameterText}` ;
        setPrompt(sentence);
    };

    return(
        <View style={styles.containerPrime}>
            <View style={styles.container}>
                <TextInput
                    style={{height: 40,backgroundColor:'white'}}
                    placeholder="Enter Destination!"
                    onChangeText={text => setDest(text)}
            
                    
                    />
       
            </View>
            <View style={styles.container}>
            <View style={{flexDirection:'row'}}>
            
                 <TextInput
                    style={{height: 40,width: 40,backgroundColor:'white'}}
                    maxLength = {2}
                    placeholder="MM"
                    onChangeText={text => setStartMonth(text)}
                 
                
                    />
                    <TextInput
                    style={{height: 40,width: 40,backgroundColor:'white'}}
                    maxLength = {2}
                    placeholder="DD"
                    onChangeText={text => setStartDay(text)}
                    
                   
                    />
                    <TextInput
                    style={{height: 40,width: 80,backgroundColor:'white'}}
                    maxLength = {4}
                    placeholder="YYYY"
                    onChangeText={text => setStartYear(text)}
                
                   
                    />
            </View>
            <View style={{flexDirection:'row'}}>
            
                 <TextInput
                    style={{height: 40,width: 40,backgroundColor:'white'}}
                    maxLength = {2}
                    placeholder="MM"
                    onChangeText={text => setEndMonth(text)}
                 
                
                    />
                    <TextInput
                    style={{height: 40,width: 40,backgroundColor:'white'}}
                    maxLength = {2}
                    placeholder="DD"
                    onChangeText={text => setEndDay(text)}
                    
                   
                    />
                    <TextInput
                    style={{height: 40,width: 80,backgroundColor:'white'}}
                    maxLength = {4}
                    placeholder="YYYY"
                    onChangeText={text => setEndYear(text)}
                
                   
                    />
            </View>
            <View style={{flexDirection:'row'}}>
               
                 
            </View>
            
            


            
            <Button
                title = 'Plan Trip'
                onPress={
                    handlePlanTrip
                  
                } />
                <Text style={{color:'white'}}>{prompt}</Text>
            </View>
            
        </View>
        

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
    dates:{
        flexDirection: 'row'
    },
   checkbox:{
        backgroundColor:'white'

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
        justifyContent: 'space-evenly',
        padding: 20,
        flex:1,
        backgroundColor: 'black',
        flexDirection: 'row'
    },
    container: {
        flex: 1, 
        justifyContent: 'flex-start', 
        alignItems: "flex-start",
        borderColor:'white',
        
        margin: 20,
      
       
    
    },
   

   
});

export default PlanAhead;