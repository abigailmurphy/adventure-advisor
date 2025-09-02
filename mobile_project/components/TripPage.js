import React, { useState, useMemo, useRef } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Button, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { useValue } from './ValueContext';
import * as ImagePicker from 'expo-image-picker';
import ImageViewerBook from './ImageViewerBook';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DetailsScreen = ({ route }) => {
  const { index } = route.params;
  const { currentValue, setCurrentValue } = useValue();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const scrollRef = React.useRef(null);

  const trip = currentValue?.completed?.[index];
  if (!trip) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text>Trip not found.</Text>
      </View>
    );
  }

  const [editPhotos, setEditPhotos] = useState(false);

  // --- Itinerary edit state ---
  const [editingPlan, setEditingPlan] = useState(false);
  const [draftPlan, setDraftPlan] = useState('');

  const beginEdit = () => {
    const cur = currentValue?.completed?.[index]?.plan ?? '';
    setDraftPlan(String(cur));
    setEditingPlan(true);
  };

  const cancelEdit = () => {
    setEditingPlan(false);
    setDraftPlan('');
  };

  const savePlan = () => {
    setCurrentValue((prev) => {
      const completed = Array.isArray(prev?.completed) ? [...prev.completed] : [];
      if (!completed[index]) return prev;
      completed[index] = { ...completed[index], plan: draftPlan.trim() };
      return { ...prev, completed };
    });
    setEditingPlan(false);
  };

  // --- Photos helpers ---
  const photos = Array.isArray(trip.photos) ? trip.photos : [];

  const handleDeletePhoto = (tripIdx, photoUri) => {
    setCurrentValue((prev) => {
      if (!prev?.completed?.[tripIdx]) return prev;
      const completed = [...prev.completed];
      const t = completed[tripIdx];

      const list = Array.isArray(t.photos) ? [...t.photos] : [];
      const removeAt = list.findIndex((u) => u === photoUri || u?.uri === photoUri?.uri);
      if (removeAt === -1) return prev;

      list.splice(removeAt, 1);
      completed[tripIdx] = { ...t, photos: list };
      return { ...prev, completed };
    });
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0]?.uri;
      if (!selectedImageUri) return;

      setCurrentValue((prev) => {
        const completed = Array.isArray(prev?.completed) ? [...prev.completed] : [];
        const t = completed[index];
        if (!t) return prev;
        const nextPhotos = Array.isArray(t.photos) ? [...t.photos, selectedImageUri] : [selectedImageUri];
        completed[index] = { ...t, photos: nextPhotos };
        return { ...prev, completed };
      });
    } else {
      Alert.alert('No image selected');
    }
  };

  const renderPhoto = ({ item }) => {
    const uri = typeof item === 'string' ? item : item?.uri;
    return (
      <View style={styles.photoCell}>
        <ImageViewerBook placeholderImageSource={null} selectedImage={uri} />
        {editPhotos && (
          <MaterialIcons
            name="delete"
            size={22}
            color="#fff"
            style={styles.deleteIcon}
            onPress={() => handleDeletePhoto(index, item)}
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={headerHeight}   // keeps content above nav header
    >
    <ScrollView
      ref={scrollRef}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets   // iOS: extra safety
      contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
    >
      <View style={{ padding: 10 }}>
        {/* Photos section */}
        <View style={styles.modalContent}>
          {!editPhotos ? (
            <>
              <Button title="Edit Photos" onPress={() => setEditPhotos(true)} />
              <FlatList
                data={photos}
                renderItem={renderPhoto}
                keyExtractor={(it, i) => `${typeof it === 'string' ? it : it?.uri || 'img'}-${i}`}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                scrollEnabled={false}
                removeClippedSubviews={false}
                contentContainerStyle={{ padding: 10 }}
              />
            </>
          ) : (
            <>
              <Button title="Done" onPress={() => setEditPhotos(false)} />
              <FlatList
                data={photos}
                renderItem={renderPhoto}
                keyExtractor={(it, i) => `${typeof it === 'string' ? it : it?.uri || 'img'}-${i}`}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                scrollEnabled={false}
                removeClippedSubviews={false}
                contentContainerStyle={{ padding: 10 }}
              />
              <Button title="Choose a photo" onPress={pickImageAsync} />
            </>
          )}
        </View>

        {/* Itinerary section */}
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.textContainers}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Itinerary</Text>

              {!editingPlan ? (
                <Pressable onPress={beginEdit} style={styles.iconBtn}>
                  <MaterialIcons name="edit" size={22} color="#111" />
                </Pressable>
              ) : (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable onPress={cancelEdit} style={styles.iconBtn}>
                    <MaterialIcons name="close" size={22} color="#111" />
                  </Pressable>
                  <Pressable onPress={savePlan} style={styles.iconBtn}>
                    <MaterialIcons name="check" size={22} color="#111" />
                  </Pressable>
                </View>
              )}
            </View>

            {!editingPlan ? (
              <Text style={{ fontSize: 20 }}>{trip.plan}</Text>
            ) : (
              <TextInput
                value={draftPlan}
                onChangeText={setDraftPlan}
                placeholder="Edit itinerary…"
                multiline
                style={styles.planInput}
              />
            )}
          </View>

          {/* spacer / future sections */}
          <View style={styles.textContainers} />
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  photoCell: {
    width: '48%',
    aspectRatio: 0.8,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  deleteIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 2,
  },
  textContainers: {
    flex: 1,
    backgroundColor: 'lavender',
    margin: 5,
    padding: 15,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#25292e',
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  planInput: {
    backgroundColor: 'white',
    minHeight: 200,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default DetailsScreen;
