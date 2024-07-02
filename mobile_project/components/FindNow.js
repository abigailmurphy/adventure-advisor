import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet,TextInput, Button, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import chatGPTService from './APIChatGPT.js';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import regeneratorRuntime from "regenerator-runtime";
import storage from './Storage';
import * as Device from 'expo-device';
import * as Location from 'expo-location';

const FindNow = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [budget, setBudget] = useState('');
  const [travelerVisible, setTravelerVisible] = useState(false);
    const [numTravelers, setTravelers] = useState('');
    const [youngest, setYoungest] = useState('');
    const [oldest, setOldest] = useState('');
  
  const [solo, setSolo] = useState(false);
    const [family, setFamily] = useState(false);
    const [romantic, setRomantic] = useState(false);
    const [friends, setFriends] = useState(false);
    const [buisness, setBuisness] = useState(false);
    const [kids, setKids] = useState(false);

    const [activityVisible, setActivityVisible] = useState(false);
    const [museum, setMuseum] = useState(false);
    const [tour, setTour] = useState(false);
    const [hiking, setHiking] = useState(false);
    const [beach, setBeach] = useState(false);
    const [landmark, setLandmark] = useState(false);
    const [historical, setHistorical] = useState(false);
    const [relaxation, setRelaxation] = useState(false);
    const [show, setShow] = useState(false);
    const [excursion, setExcursion] = useState(false);
    const [art, setArt] = useState(false);
    const [natural, setNatural] = useState(false);
    const [wine, setWine] = useState(false);
    const [bar, setBar] = useState(false);
    const [club, setClub] = useState(false);
    const [ski, setSki] = useState(false);
    const [golf, setGolf] = useState(false);
    const [sport, setSport] = useState(false);
    const [moreActivities, setMoreActivities] = useState('');
    const [avoid, setAvoid] = useState('');

    const [foodVisible, setFoodVisible] = useState(false);
    const [localFood, setLocalFood] = useState(false);
    const [seafood, setSeafood] = useState(false);
    const [upscale, setUpscale] = useState(false);
    const [foodTruck, setFoodTruck] = useState(false);
    const [moreFood, setMoreFood] = useState('');
    const [foodDislike, setFoodDislike] = useState('');



    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

    const handlePlanTrip = () => {
        let time = new Date().toLocaleTimeString();

        const finalDay = `Plan the rest of my day at ${text} starting at ${time}.`;
        setPrompt(finalDay);
        console.log('Final day:', finalDay);
        handleSend({sentence: finalDay});
        


    }

    const handleSend = async ({sentence}) => {
        setLoading(true);
        try {
            const response = await chatGPTService(sentence);
            setResponseText(response);
        
        } catch (error) {
            setResponseText(`Error: ${error.response ? error.response.data.error.message : error.message}`);
        } finally {
            setLoading(false);
        }
    };

   

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setAddress(address[0]);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (address) {
    text = `${address.street}, ${address.city}, ${address.region}, ${address.country}`;
    
  }

  return (
    <SafeAreaView style={styles.containerPrime}>
    <ScrollView>         

     <View style={styles.container}>
         {loading ? (
             <ActivityIndicator size="large" />
         ) : responseText !=''? (
             
             <SafeAreaView style={styles.responseContainer}>  
                 <Button
                     onPress={() =>{setResponseText('')}}
                     title="Back to Planning"
                     color="#841584"
                     accessibilityLabel="Learn more about this purple button"
                 /> 
                 <Button
                     onPress={() =>{
                         
                   
                     setResponseText('')
                        
                         
                     }}
                 
                     
                     title="Save"
                     color="#841584"
                     accessibilityLabel="Learn more about this purple button"
                 /> 
                 <Text style={styles.responseText}>{responseText}</Text> 

             </SafeAreaView>
             
         
         ): (<></>)}
         <Text style = {styles.header}>{prompt}</Text>
         <View style={styles.promptContainer}>
         <Pressable
             title = 'Plan Trip!'
             style ={styles.press}
             onPress={handlePlanTrip} >
             <Text style={{color:'white',fontSize:'20'}}>Plan the Rest of my day!</Text>
         </Pressable>
            
         </View>
         
         <Text style = {styles.header}>{text}</Text>

         <Text style = {styles.header2}>Budget</Text>
             <TextInput
                 style={styles.input}
                 placeholder="EnterBudget"
                 onChangeText={text => setBudget(text)}
             />
        
        

      <View style ={{flexDirection: 'row', justifyContent: 'speace-evenly', alignContent:'center'}}>
             <Text style = {styles.header2}>Group Details</Text>
             <Pressable
                 title = {travelerVisible ? "Collapse" : "Expand"}
                 onPress={() => {setTravelerVisible(!travelerVisible)}} >
                 <Text style={{color:'white', margin:20}}>{travelerVisible ? <MaterialIcons name="expand-less" size={24} color="white" /> : <MaterialIcons name="expand-more" size={24} color="white" />}</Text>
             </Pressable>
     </View>

     {travelerVisible && (  
       <>

     <Text style = {styles.header}>Trip Type</Text>
         <View style={styles.checkContainer}>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, solo && styles.checkboxChecked]}
                     onPress={() => setSolo(!solo)}>
                     {solo && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Solo`}</Text>
             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, family && styles.checkboxChecked]}
                     onPress={() => setFamily(!family)}>
                     {family && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Family`}</Text>
             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, romantic && styles.checkboxChecked]}
                     onPress={() => setRomantic(!romantic)}>
                     {romantic && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Romantic`}</Text>
             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, friends && styles.checkboxChecked]}
                     onPress={() => setFriends(!friends)}>
                     {friends && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Friends`}</Text>
             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, buisness && styles.checkboxChecked]}
                     onPress={() => setBuisness(!buisness)}>
                     {buisness && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Buisness`}</Text>
             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, kids && styles.checkboxChecked]}
                     onPress={() => setKids(!kids)}>
                     {kids && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Kid-Friendly`}</Text>
             </View>
             
         </View>

         
         

         <Text style = {styles.header}>Age Range</Text>
         <View style={styles.dateInputContainer}>
             <TextInput
                 style={styles.dateInput}
                 maxLength={2}
                 placeholder="MinAge"
                 onChangeText={text => setYoungest(text)}
             />
             <TextInput
                 style={styles.dateInput}
                 maxLength={3}
                 placeholder="MaxAge"
                 onChangeText={text => setOldest(text)}
             />
             
             
         </View> 
         </>
         )}
      
       
      <View style ={{flexDirection: 'row', justifyContent: 'speace-evenly', alignContent:'center'}}>
             <Text style = {styles.header2}>Requested Activities</Text>
             <Pressable
                 title = {activityVisible ? "Collapse" : "Expand"}
                 onPress={() => {setActivityVisible(!activityVisible)}} >
                 <Text style={{color:'white', margin:20}}>{activityVisible ? <MaterialIcons name="expand-less" size={24} color="white" /> : <MaterialIcons name="expand-more" size={24} color="white" />}</Text>
             </Pressable>
     </View>
         {activityVisible && (
         <>
         <View style={styles.checkContainer}>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, museum && styles.checkboxChecked]}
                     onPress={() => setMuseum(!museum)}>
                     {museum && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Museums`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, tour && styles.checkboxChecked]}
                     onPress={() => setTour(!tour)}>
                     {tour && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Guided Tours`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, hiking && styles.checkboxChecked]}
                     onPress={() => setHiking(!hiking)}>
                     {hiking && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Hiking`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, beach && styles.checkboxChecked]}
                     onPress={() => setBeach(!beach)}>
                     {beach && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Beaches`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, landmark && styles.checkboxChecked]}
                     onPress={() => setLandmark(!landmark)}>
                     {landmark && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Landmarks`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, historical && styles.checkboxChecked]}
                     onPress={() => setHistorical(!historical)}>
                     {historical && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Historical Sites`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, relaxation && styles.checkboxChecked]}
                     onPress={() => setRelaxation(!relaxation)}>
                     {relaxation && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Relaxation`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, excursion && styles.checkboxChecked]}
                     onPress={() => setExcursion(!excursion)}>
                     {excursion && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Local Excusions`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, show && styles.checkboxChecked]}
                     onPress={() => setShow(!show)}>
                     {show && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Shows/Entertainment`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, art && styles.checkboxChecked]}
                     onPress={() => setArt(!art)}>
                     {art && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Art`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, natural && styles.checkboxChecked]}
                     onPress={() => setNatural(!natural)}>
                     {natural && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Natural Sites`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, wine && styles.checkboxChecked]}
                     onPress={() => setWine(!wine)}>
                     {wine && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Wine Tour`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, bar && styles.checkboxChecked]}
                     onPress={() => setBar(!bar)}>
                     {bar && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Bars`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, club && styles.checkboxChecked]}
                     onPress={() => setClub(!club)}>
                     {club && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Clubs`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, ski && styles.checkboxChecked]}
                     onPress={() => setSki(!ski)}>
                     {ski && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Skiing`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, golf && styles.checkboxChecked]}
                     onPress={() => setGolf(!golf)}>
                     {golf && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Golf`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, sport && styles.checkboxChecked]}
                     onPress={() => setSport(!sport)}>
                     {sport && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Additional Sports`}</Text>

             </View>
         </View>
         <Text style={styles.checkboxLabel}>Additional Activities:</Text>
         <TextInput
             style={styles.input}
             placeholder="Additional Activities"
             onChangeText={text => setMoreActivities(text)}
         />
         <Text style={styles.checkboxLabel}>Avoid:</Text>
         <TextInput
             style={styles.input}
             placeholder="Avoid"
             onChangeText={text => setAvoid(text)}
         />
         </>
         )}

     <View style ={{flexDirection: 'row', justifyContent: 'speace-evenly', alignContent:'center'}}>
             <Text style = {styles.header2}>Food Preferences</Text>
             <Pressable
             title = {foodVisible ? "Collapse" : "Expand"}
             onPress={() => {setFoodVisible(!foodVisible)}} >
                 <Text style={{color:'white', margin:20}}>{foodVisible ? <MaterialIcons name="expand-less" size={24} color="white" /> : <MaterialIcons name="expand-more" size={24} color="white" />}</Text>
             </Pressable>
     </View>
         {foodVisible && (
             <>
         <View style={styles.checkContainer}>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, localFood && styles.checkboxChecked]}
                     onPress={() => setLocalFood(!localFood)}>
                     {localFood && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Local Specialties`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, seafood && styles.checkboxChecked]}
                     onPress={() => setSeafood(!seafood)}>
                     {seafood && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Seafood`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, upscale && styles.checkboxChecked]}
                     onPress={() => setUpscale(!upscale)}>
                     {upscale && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Upscale`}</Text>

             </View>
             <View style={styles.checkboxContainer}>
                 <Pressable
                     style={[styles.checkboxBase, foodTruck && styles.checkboxChecked]}
                     onPress={() => setFoodTruck(!foodTruck)}>
                     {foodTruck && <Ionicons name="checkmark" size={20} color="white" />}
                 </Pressable>
                 <Text style={styles.checkboxLabel}>{`Food Trucks`}</Text>

             </View>
           
         </View>
         <Text style={styles.checkboxLabel}>Additional Food Preference: </Text>
         <TextInput
             style={styles.input}
             placeholder="Additional Food Preferences"
             onChangeText={text => setMoreFood(text)}
         />
         <Text style={styles.checkboxLabel}>Food Dislikes:</Text>
         <TextInput
             style={styles.input}
             placeholder="Food Dislikes"
             onChangeText={text => setFoodDislike(text)}
         />
         </>
          )}
     </View>
     
        
     </ScrollView>
 </SafeAreaView>
 
);
}

const styles = StyleSheet.create({
containerPrime: {
 justifyContent: 'space-evenly',
 padding: 20,
 flex: 1,
 backgroundColor: 'black',
 
},
header:{
 fontSize: 20,
 color: 'white',
 marginTop: 10,
 marginBottom: 5
 
},
header2:{
 fontSize: 25,
 color: 'white',
 marginTop: 10,
 marginBottom: 5
 
},
responseContainer: {
 justifyContent: 'center',
 backgroundColor: 'white',
 alignContent: 'center',
 borderRadius: 10,
 margin: 10,
 

},
container: {
 flex: 1,
 justifyContent: 'flex-start',
 alignItems: 'flex-start',
 borderColor: 'white',
 margin: 20,
},
input: {
 height: 40,
 backgroundColor: 'white',
 marginVertical: 5,
 paddingHorizontal: 10,
 borderRadius: 5,
},
checkContainer:{
 flexDirection: 'row',
 marginVertical: 10,
 justifyContent: 'space-between',
 flexWrap: 'wrap',


},
dateInputContainer: {
 flexDirection: 'row',
 marginVertical: 10,
 

},
dateInput: {
 height: 40,
 width: 40,
 backgroundColor: 'white',
 marginHorizontal: 5,
 textAlign: 'center',
 borderRadius: 5,
},
promptContainer: {
 flexDirection: 'row',
 alignItems: 'center',
 marginVertical: 10,
},
loadingText: {
 color: 'white',
 marginVertical: 10,
},
responseText: {
 color: 'black',
 marginVertical: 10,
 margin: 10,
 
},
promptText: {
 color: 'white',
 marginVertical: 10,
},
checkboxBase: {
 width: 20,
 height: 20,
 justifyContent: 'center',
 alignItems: 'center',
 borderRadius: 4,
 borderWidth: 2,
 borderColor: 'coral',
 backgroundColor: 'transparent',
},
checkboxChecked: {
 backgroundColor: 'coral',
},
checkboxContainer: {
 flexDirection: 'row',
 alignItems: 'flex-start',
 padding:8
},
checkboxLabel: {
 marginLeft: 8,
 fontWeight: 500,
 fontSize: 16,
 color:'white'
},
press:{
 backgroundColor: 'royalblue', 
 width: 250, 
 height: 50,
 borderRadius:10, 
 flexDirection:'row',
 justifyContent: 'center',
 alignItems: 'center',
 
 color: 'white'
 

},
});

export default FindNow;

