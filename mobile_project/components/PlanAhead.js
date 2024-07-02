import React, { useState, useEffect } from 'react';
import {Alert, Modal, StyleSheet, Text, View, TextInput, Button, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import chatGPTService from './APIChatGPT.js';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import regeneratorRuntime from "regenerator-runtime";
import {useValue} from './ValueContext';

const PlanAhead = () => {
    const {currentValue,setCurrentValue} = useValue();
    const [dest, setDest] = useState('');
    const [prompt, setPrompt] = useState('');
    const [budget, setBudget] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    
    const [travelerVisible, setTravelerVisible] = useState(false);
    const [numTravelers, setTravelers] = useState('');
    const [youngest, setYoungest] = useState('');
    const [oldest, setOldest] = useState('');

    const [hotel, setHotel] = useState(false);

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
    const [modalVisible, setModalVisible] = useState(false);
    const [trips, setTrips]= useState([]);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showTimePickerEnd, setShowTimePickerEnd] = useState(false);

    const showTimePickerModal = () => {
        setShowTimePicker(!showTimePicker);
    };
    const showTimePickerModalEnd = () => {
        setShowTimePickerEnd(!showTimePickerEnd);
    };
    const handleTimeChangeEnd = (event, selectedDateEnd) => {
        if (selectedDateEnd) {
            setEndDate(selectedDateEnd);
        }
    };
 
    const handleTimeChange = (event, selectedDate) => {
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    

    const handlePlanTrip = () => {
        let tripType = "";
        solo  ? tripType += "for a solo taveler, " : "";
        family ? tripType += "with family, ": "";
        romantic ? tripType += "that is romantic, " : "";
        friends  ? tripType += "with friends, " : "";
        buisness  ? tripType += "working around the buisness day, " : "";
        kids ? tripType += "that is kid friendly, " : "";



        let allActivities = "";
        museum ? allActivities += "museums, " : "";
        tour ? allActivities += "guided tours, " : "";
        hiking ? allActivities += "hiking, " : "";
        beach ? allActivities += "visiting beaches, " : "";
        landmark ? allActivities += "guided tours, " : "";
        historical ? allActivities += "visiting historical sites, " : "";
        relaxation ? allActivities += "time and services for relaxation, " : "";
        show ? allActivities += "shows and entertainment nearby, " : "";
        excursion ? allActivities += "local excursions, " : "";
        art ? allActivities += "art known to the area, " : "";
        natural ? allActivities += "visiting natural sites and landmarks, " : "";
        wine ? allActivities += "a wine tour, " : "";
        bar ? allActivities += "bars to visit, " : "";
        club ? allActivities += "clubbing, " : "";
        ski ? allActivities += "skiing, " : "";
        golf ? allActivities += "golfing, " : "";
        sport ? allActivities += "other sports and outdoor activities, " : "";
        moreActivities != '' ? allActivities += `${moreActivities}` : "";
        avoid != '' ? allActivities += `. Avoid activities such as ${avoid}` : "";

        if(allActivities != ''){
            allActivities =`Be sure to include the following activities and sights on this trip: ${allActivities}.`;
        }

        let budgetIncluded ='';

        budget != '' ? budgetIncluded += `with a budget of ${budget} dollars collectively` : "";

        let allFood = "";
        localFood ? allFood += "local specialties, ": "";
        seafood ? allFood += "seafood, ": "";
        upscale ? allFood += "an upscale restaurant or dining experience, ": "";
        foodTruck ? allFood += "foodTrucks, ": "";
        moreFood != "" ? allFood += `${moreFood}`: "";
        foodDislike != "" ? allFood += `. Avoid foods such as ${foodDislike}`: "";

        if(allFood != ''){
            allFood = `For meals, include the following foods: ${allFood}.`
        }

        const hotelRec = hotel ? "Include a hotel or resort recommendation." : "";
        const numPeople = numTravelers != '' ? `for ${numTravelers} people`  : "";

        let ageConstraint = '';
        if(youngest != '' && oldest !=''){
            ageConstraint = `with traveler ages ranging from ${youngest} to ${oldest} years old`;
        }

        let dates = '';
        const formattedStartDate = startDate.toLocaleDateString();
        const formattedEndDate = endDate.toLocaleDateString();

        formattedStartDate != formattedEndDate ? dates = `between the dates ${formattedStartDate} and ${formattedEndDate}` : dates = 'for one day';

        const sentence = `Build an itinerary for a trip to ${dest} ${tripType} ${numPeople}, ${budgetIncluded} ${dates}
        ${ageConstraint}. ${hotelRec} ${allActivities} ${allFood}`;
        
        setPrompt(sentence);
        handleSend({sentence});
    };
   
    const handleSend = async ({sentence}) => {
        setLoading(true);
        try {
            const response = await chatGPTService(sentence);
            setResponseText(response);
            setModalVisible(true);
        } catch (error) {
            setResponseText(`Error: ${error.response ? error.response.data.error.message : error.message}`);
        } finally {
            setLoading(false);
        }
    };


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
                                const newTrips =
                                currentValue['trips'].concat(
                                {'plan': responseText,
                                 'prompt': prompt,
                                'destination':dest,
                                'startDate': startDate,
                                'endDate' : endDate
                                
                                })
                                setCurrentValue({...currentValue, trips: newTrips})
                          
                            setResponseText('')
                               
                                
                            }}
                        
                            
                            title="Save"
                            color="#841584"
                            accessibilityLabel="Learn more about this purple button"
                        /> 
                       
                
                        <Text style={styles.responseText}>{responseText}</Text> 
      
                    </SafeAreaView>
                    
                
                ): (<></>)}
                
                <View style={styles.promptContainer}>
                <Pressable
                    title = 'Plan Trip!'
                    style ={styles.press}
                    onPress={handlePlanTrip} >
                    <FontAwesome6 name="map-location" size={20} color="white" />
                    <Text style={{color:'white',marginLeft: 10,fontSize:'20'}}>Lets Go!</Text>
                </Pressable>
                   
                </View>
                


                
                <Text style = {styles.header2}>Destination</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Destination!"
                        onChangeText={text => setDest(text)}
                    />
                
                <View style={styles.checkboxContainer}>
                        <Pressable
                            style={[styles.checkboxBase, hotel && styles.checkboxChecked]}
                            onPress={() => setHotel(!hotel)}>
                            {hotel && <Ionicons name="checkmark" size={20} color="white" />}
                        </Pressable>
                        <Text style={styles.checkboxLabel}>{`Include Hotel Recommendation`}</Text>
                </View>
                <Text style = {styles.header2}>Budget</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="EnterBudget"
                        onChangeText={text => setBudget(text)}
                    />
                
                <Pressable title="Set Start Date" onPress={showTimePickerModal}>
                    <Text style = {styles.header}> 
                    <FontAwesome6 name="calendar-days" size={24} color="white" />  Set Start Date: {startDate.toLocaleDateString()}</Text>
                </Pressable>
               
                {showTimePicker && (
                    <>
                    <DateTimePicker
                    value={startDate}
                    mode="date"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChange}
                />
                <Button title = "confirm" onPress ={showTimePickerModal}/>
                </>     
                )}
                
                <Pressable title="Set End Date" onPress={showTimePickerModalEnd}>
                    <Text style = {styles.header}> 
                    <FontAwesome6 name="calendar-days" size={24} color="white" />  Set End Date: {endDate.toLocaleDateString()}</Text>
                </Pressable>
               
                {showTimePickerEnd && (
                    <>
                    <DateTimePicker
                    value={startDate}
                    mode="date"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChangeEnd}
                />
                <Button title = "confirm" onPress ={showTimePickerModalEnd}/>
                </>     
                )}

             <View style ={{flexDirection: 'row', justifyContent: 'speace-evenly', alignContent:'center'}}>
                    <Text style = {styles.header2}>Traveler Details</Text>
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
    
                
                <Text style = {styles.header}>Number of People on Trip</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="How many travelers?"
                        onChangeText={text => setTravelers(text)}
                    />

                <Text style = {styles.header}>Age Range of Travelers</Text>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        color: 'white'
        

    },
});

export default PlanAhead;
