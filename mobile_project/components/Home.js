import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ImageBackground, Pressable, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './Settings.js';
import ProfileScreen from './Profile.js';
import ScrapBookScreen from './ScrapBook.js';
import CaptureScreen from './Capture.js';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useValue } from './ValueContext';
import TripPageScreen from './TripPage';
import SpinningGlobe from './SpinningGlobe.js';






async function geocodeWithNominatim(q) {
 
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    q
  )}`;
  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'AdventureAdvisorRN/1.0 (contact: you@example.com)',
    },
  });
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  const data = await res.json();
  const hit = data?.[0];
  if (!hit) return null;
  return { lat: parseFloat(hit.lat), lon: parseFloat(hit.lon) };
}

async function geocodePlace(q) {
  if (!q) return null;
  try {
   
    return await geocodeWithNominatim(q); 
  } catch {
    return null;
  }
}

// destination-only extraction; allow string entries for convenience
function extractQueryAndLabel(item) {
  if (typeof item === 'string') {
    const q = item.trim();
    return { query: q, label: q };
  }
  if (item && typeof item === 'object') {
    const q = String(item.destination ?? '').trim(); // ONLY use destination
    return { query: q, label: q };
  }
  return { query: '', label: '' };
}

/** ------------------------- UI ------------------------- */

function HomeScreen({ navigation }) {
  const { currentValue } = useValue();

  const [pins, setPins] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const cacheRef = useRef(new Map()); // query -> {lat, lon}

  const completedList = Array.isArray(currentValue?.completed)
    ? currentValue.completed
    : [];

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsGeocoding(true);
      setGeoError(null);

      const out = [];

      for (const item of completedList) {
        try {
          // If already geocoded, just use it
          if (
            item &&
            typeof item === 'object' &&
            typeof item.lat === 'number' &&
            typeof item.lon === 'number'
          ) {
            out.push({
              lat: item.lat,
              lon: item.lon,
              label: String(item.destination ?? '').trim(),
            });
            continue;
          }

          const { query, label } = extractQueryAndLabel(item);
          if (!query) continue;

          const key = query.toLowerCase();
          let coords = cacheRef.current.get(key);

          if (!coords) {
            coords = await geocodePlace(query);
            if (coords) cacheRef.current.set(key, coords);
            // be polite to free services
            await new Promise((r) => setTimeout(r, 250));
          }

          if (coords?.lat != null && coords?.lon != null) {
            out.push({ lat: coords.lat, lon: coords.lon, label: label || query });
          }
        } catch {
          if (!geoError) setGeoError('Some locations could not be geocoded.');
        }
      }

      if (isActive) {
        setPins(out);
        setIsGeocoding(false);
      }
    };

    run();
    return () => {
      isActive = false;
    };
  }, [JSON.stringify(completedList)]); // rerun when the list changes

  return (
    <View style={styles.containerPrime}>
      <ImageBackground
        source={require('./assets/images/background.jpg')}
        style={{ flex: 1 }}
      >
        <View style={styles.containerTop}>
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={35} color="white" />
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Profile')}>
            <MaterialIcons name="account-circle" size={35} color="white" />
          </Pressable>
        </View>

        <View style={styles.container}>
          <SpinningGlobe pins={pins} size={320} autoSpin />
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
            Welcome {currentValue?.username}!
          </Text>
          {isGeocoding ? (
            <Text style={{ color: 'white', fontSize: 12, opacity: 0.8 }}>
              Mapping your destinations…
            </Text>
          ) : null}
          {geoError ? (
            <Text style={{ color: '#ffdddd', fontSize: 12 }}>{geoError}</Text>
          ) : null}
        </View>

        <View style={styles.container1}>
          <Pressable
            style={styles.press}
            onPress={() => navigation.navigate('ScrapBook')}
          >
            <FontAwesome name="photo" size={30} color="white" />
            <Text style={{ color: 'white', marginLeft: 10 }}>My ScrapBook</Text>
          </Pressable>

          <Pressable
            style={styles.press}
            onPress={() => navigation.navigate('Capture')}
          >
            <MaterialIcons name="add-a-photo" size={30} color="white" />
            <Text style={{ color: 'white', marginLeft: 10 }}>
              Capture Your Adventure
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Home = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Capture" component={CaptureScreen} />
      <Stack.Screen name="ScrapBook" component={ScrapBookScreen} />
      <Stack.Screen
        name="TripPage"
        component={TripPageScreen}
        options={({ route }) => ({ title: route?.params?.title ?? 'Trip' })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 100, // RN expects a number
    height: 200,
    width: 200,
    borderWidth: 10,
    borderColor: 'lightgrey',
  },
  press: {
    backgroundColor: 'royalblue',
    width: 300,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  containerPrime: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'flex-end',
  },
  container1: {
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  containerTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 30,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: 'blue',
    borderWidth: 1,
  },
  text2: {
    fontSize: 25,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    color: 'white',
    borderRadius: 2,
    width: 250,
    height: 50,
    fontSize: 20,
  },
});

export default Home;
