
import React, { useState, useEffect } from 'react';
import { Modal,View, Text, StyleSheet,ScrollView,Button,FlatList} from 'react-native';
import {useValue} from './ValueContext';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from './ImageViewer';
import ImageViewerBook from './ImageViewerBook';
import { MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';


const DetailsScreen = ({ route }) => {
  const { index} = route.params;
    const {currentValue, setCurrentValue} = useValue();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showItinerary, setShowItinerary] = useState(false);
    const [editPhotos, setEditPhotos] = useState(false);
    let half = currentValue['completed'][index].photos.length;

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            setSelectedImage(selectedImageUri);
           
            
            // Update the completed array with the updated item
            const updatedCompleted = [...currentValue.completed];

            const item = updatedCompleted[index];

            const updatedItem = {
                ...item,
                photos: [...item.photos, selectedImageUri],
              };
            updatedCompleted[index] = updatedItem;
      
            // Update the currentValue with the updated completed array
            setCurrentValue({ ...currentValue, completed: updatedCompleted });

      
        } else {
          alert('You did not select any image.');
        }
      }

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

    const renderImages = ({item, no}) =>{
    
        return(
        <View style= {{padding:5}}>
       
        <ImageViewerBook placeholderImageSource={null} selectedImage={item} />
        </View>
        );
        
    };

    const renderImagesDelete = ({item, no}) =>{
    
        return(
            <View style={{ position: 'relative', padding: 5 }}>
        <ImageViewerBook placeholderImageSource={null} selectedImage={item} />
        <MaterialIcons name="delete" size={24} color="white" style={styles.deleteIcon} onPress={() => handleDeletePhoto(index)} />
      </View>
        );
        
    };
  

  return (
    <ScrollView>
    <View style ={{padding:10}}>
       

       
             <View style={styles.modalContent}>
       

            
                <Button title = 'Edit Photos' onPress ={() => {setEditPhotos(!editPhotos)}}/>

                {!editPhotos ? (
                    <>
                    <FlatList
                    data={currentValue['completed'][index].photos.slice(0,Math.ceil(half/2))}
                    renderItem={renderImages}
                    keyExtractor={(item, no) => no.toString()}
                 
                    columnWrapperStyle={styles.column}
                    horizontal = {true}
                />
            <FlatList
                    data={currentValue['completed'][index].photos.slice(Math.ceil(half/2),half)}
                    renderItem={renderImages}
                    keyExtractor={(item, no) => no.toString()}
                 
                    columnWrapperStyle={styles.column}
                    horizontal = {true}
                />
                
                    </>
                    
                    

                ):(<>
                <FlatList
                    data={currentValue['completed'][index].photos.slice(0,Math.ceil(half/2))}
                    renderItem={renderImagesDelete}
                    keyExtractor={(item, no) => no.toString()}
                 
                    columnWrapperStyle={styles.column}
                    horizontal = {true}
                />
                <FlatList
                    data={currentValue['completed'][index].photos.slice(Math.ceil(half/2),half)}
                    renderItem={renderImagesDelete}
                    keyExtractor={(item, no) => no.toString()}
                 
                    columnWrapperStyle={styles.column}
                    horizontal = {true}
                />
                    <Button title ="Choose a photo" onPress={pickImageAsync} />
                    
                
                </>)}
            </View>
    
      

        <View style={{flexDirection:'column'}}>
            <View style={styles.textContainers}>
                <Text style ={styles.header}>Itinerary</Text>
                <Text style={{fontSize: 15}}>{currentValue.completed[index].plan}</Text>

            </View >
            <View style={styles.textContainers}>

            </View>


        </View>
      
      
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainers: {
    flex:1,
    backgroundColor: 'lavender',
    margin: 5,
    padding: 15,
    borderRadius: 10

  },
  header: {
    fontSize:25,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#25292e'
  },

  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalContent: {
    height: '40%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  
    bottom: 0,
  },
});

export default DetailsScreen;
