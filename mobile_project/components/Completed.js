import React, { useState, useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable, Button, FlatList, TextInput } from 'react-native';
import { useValue } from './ValueContext';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const getTripKey = (t, idx) =>
  t?._id ??
  `${t?.destination ?? 'Trip'}|${t?.startDate ?? ''}|${t?.endDate ?? ''}|${idx}`;

export default function Completed() {
  const { currentValue, setCurrentValue } = useValue();
  const completed = Array.isArray(currentValue?.completed) ? currentValue.completed : [];

  // State keyed by stable tripKey (not index)
  const [expandedByKey, setExpandedByKey] = useState({});
  const [editByKey, setEditByKey] = useState({});
  const [draftByKey, setDraftByKey] = useState({});

  // Toggle expand
  const toggleExpand = (key) => {
    setExpandedByKey((s) => ({ ...s, [key]: !s[key] }));
  };

  // Start/stop edit, seed draft with current plan
  const toggleEdit = (key, item) => {
    setEditByKey((s) => {
      const next = !s[key];
      // seed draft on opening
      if (next) {
        setDraftByKey((d) => ({ ...d, [key]: String(item?.plan ?? '').trim() }));
      }
      return { ...s, [key]: next };
    });
  };

  const handleInputChange = (key, text) => {
    setDraftByKey((d) => ({ ...d, [key]: text }));
  };

  const saveChanges = (key) => {
    const idx = completed.findIndex((t, i) => getTripKey(t, i) === key);
    if (idx === -1) return;

    const updated = [...completed];
    updated[idx] = { ...updated[idx], plan: String(draftByKey[key] ?? '').trim() };

    setCurrentValue((prev) => ({ ...prev, completed: updated }));
    setEditByKey((s) => ({ ...s, [key]: false }));
  };

  const deleteTripByKey = (key) => {
    // remove from data
    const nextCompleted = completed.filter((t, i) => getTripKey(t, i) !== key);
    // clean per-row state
    setExpandedByKey(({ [key]: _, ...rest }) => rest);
    setEditByKey(({ [key]: __, ...rest }) => rest);
    setDraftByKey(({ [key]: ___, ...rest }) => rest);

    setCurrentValue((prev) => ({ ...prev, completed: nextCompleted }));
  };

  const moveToTrips = (item, key) => {
    const idx = completed.findIndex((t, i) => getTripKey(t, i) === key);
    if (idx === -1) return;

    const nextTrips = Array.isArray(currentValue?.trips) ? [...currentValue.trips] : [];
    // Preserve all fields (including photos/titlephoto)
    const { plan, prompt, destination, startDate, endDate, photos, titlephoto } = item;
    nextTrips.push({ plan, prompt, destination, startDate, endDate, photos, titlephoto });

    const nextCompleted = completed.filter((_, i) => i !== idx);

    // Clean per-row state
    setExpandedByKey(({ [key]: _, ...rest }) => rest);
    setEditByKey(({ [key]: __, ...rest }) => rest);
    setDraftByKey(({ [key]: ___, ...rest }) => rest);

    setCurrentValue((prev) => ({ ...prev, trips: nextTrips, completed: nextCompleted }));
  };

  const renderTrip = ({ item, index }) => {
    const key = getTripKey(item, index);
    const isExpanded = !!expandedByKey[key];
    const isEditing = !!editByKey[key];
    const draft = draftByKey[key] ?? String(item?.plan ?? '');

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Pressable onPress={() => moveToTrips(item, key)}>
            <MaterialCommunityIcons name="airplane-check" size={30} color="green" />
          </Pressable>

          <Text style={styles.title}>{item?.destination ?? 'Trip'}</Text>

          <Pressable onPress={() => toggleExpand(key)}>
            {isExpanded ? (
              <MaterialIcons name="expand-less" size={24} color="black" />
            ) : (
              <MaterialIcons name="expand-more" size={24} color="black" />
            )}
          </Pressable>
        </View>

        {isExpanded && (
          <>
            {!isEditing ? (
              <>
                <View style={styles.rowRight}>
                  <Pressable onPress={() => toggleEdit(key, item)}>
                    <MaterialIcons name="edit" size={24} color="black" />
                  </Pressable>
                </View>
                <Text>{item?.plan ?? ''}</Text>
              </>
            ) : (
              <>
                <Button title="Save Changes" onPress={() => saveChanges(key)} />
                <View style={{ padding: 10 }}>
                  <TextInput
                    placeholder="Edit itinerary…"
                    style={styles.textArea}
                    value={draft}
                    multiline
                    onChangeText={(txt) => handleInputChange(key, txt)}
                  />
                </View>

                <Pressable style={{ marginTop: 30, alignSelf: 'center' }} onPress={() => deleteTripByKey(key)}>
                  <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', gap: 6 }}>
                    <MaterialIcons name="delete" size={20} color="red" />
                    <Text style={{ fontSize: 20, color: 'red' }}>Delete this Itinerary</Text>
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
      <Button title="clear" onPress={() => setCurrentValue({ ...currentValue, trips: [] })} />
      <FlatList
        data={completed}
        renderItem={renderTrip}
        keyExtractor={(it, i) => getTripKey(it, i)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerPrime: { flex: 1, backgroundColor: 'white', padding: 20 },
  card: {
    flex: 1,
    justifyContent: 'flex-start',
    margin: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    padding: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 20 },
  rowRight: { flexDirection: 'row', justifyContent: 'flex-end', padding: 10 },
  textArea: {
    backgroundColor: 'white',
    minHeight: 250,
    padding: 20,
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});
