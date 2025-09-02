// Capture.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useValue } from './ValueContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons, Feather } from '@expo/vector-icons';

function fmtYear(s) {
  if (!s) return '—';
  try {
    return String(new Date(s).getFullYear());
  } catch {
    return String(s).slice(0, 4);
  }
}
function toDateSafe(d) {
  const t = new Date(d);
  return isNaN(t) ? null : t;
}

export default function CaptureScreen({ navigation }) {
  const { currentValue, setCurrentValue } = useValue();
  const completed = Array.isArray(currentValue?.completed) ? currentValue.completed : [];

  const [permission, requestPermission] = useCameraPermissions();
  const camRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [capturedUri, setCapturedUri] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTripIdx, setSelectedTripIdx] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const suggestedTripIdx = useMemo(() => {
    if (!completed.length) return null;
    const now = new Date();

    const enriched = completed.map((t, idx) => ({
      idx,
      start: toDateSafe(t.startDate),
      end: toDateSafe(t.endDate),
      raw: t,
    }));

    
    const ongoing = enriched.filter(
      (e) => e.start && e.end && e.start <= now && now <= e.end
    );
    if (ongoing.length) {
    
      ongoing.sort((a, b) => b.start - a.start);
      return ongoing[0].idx;
    }

    const past = enriched
      .map((e) => ({
        ...e,
        endOrStart: e.end ?? e.start ?? null,
      }))
      .filter((e) => e.endOrStart && e.endOrStart <= now)
      .sort((a, b) => b.endOrStart - a.endOrStart);

    if (past.length) return past[0].idx;

    
    return enriched[enriched.length - 1].idx;
  }, [completed]);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  
  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Checking camera permissions…</Text>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ textAlign: 'center', marginBottom: 12 }}>
          We need your permission to use the camera.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    try {
      if (!camRef.current) return;
      const photo = await camRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });
      if (!photo?.uri) return;
      setCapturedUri(photo.uri);

      
      setSelectedTripIdx(suggestedTripIdx);
      setDropdownOpen(false);
      setShowConfirm(true);
    } catch (e) {
      Alert.alert('Capture failed', String(e?.message ?? e));
    }
  };

  const confirmAdd = () => {
    if (selectedTripIdx == null) {
      Alert.alert('No trip selected', 'Please choose a trip to attach the photo.');
      return;
    }
    if (!capturedUri) {
      setShowConfirm(false);
      return;
    }

    setCurrentValue((prev) => {
      const completedPrev = Array.isArray(prev?.completed) ? [...prev.completed] : [];
      const t = completedPrev[selectedTripIdx];
      if (!t) return prev;

      const nextPhotos = Array.isArray(t.photos) ? [...t.photos, capturedUri] : [capturedUri];
      completedPrev[selectedTripIdx] = { ...t, photos: nextPhotos };
      return { ...prev, completed: completedPrev };
    });

    setShowConfirm(false);
    setCapturedUri(null);
    Alert.alert('Added!', 'Photo attached to your trip.');
  };

  const cancelAdd = () => {
    setShowConfirm(false);
    setCapturedUri(null);
  };

  const TripRow = ({ item, index }) => {
    const isSelected = index === selectedTripIdx;
    return (
      <Pressable
        onPress={() => setSelectedTripIdx(index)}
        style={[styles.tripRow, isSelected && styles.tripRowSelected]}
      >
        <Text style={[styles.tripRowText, isSelected && styles.tripRowTextSelected]}>
          {item.destination} {fmtYear(item.startDate)}
        </Text>
        {isSelected ? (
          <MaterialIcons name="radio-button-checked" size={20} color="#fff" />
        ) : (
          <MaterialIcons name="radio-button-unchecked" size={20} color="#999" />
        )}
      </Pressable>
    );
  };

  const selectedLabel =
    selectedTripIdx != null && completed[selectedTripIdx]
      ? `${completed[selectedTripIdx].destination} ${fmtYear(
          completed[selectedTripIdx].startDate
        )}`
      : 'Choose a trip';

  return (
    <View style={styles.root}>
      <CameraView
        ref={camRef}
        style={styles.camera}
        facing={facing}
        mute
      >
        {/* Top bar */}
        <SafeAreaView>
          <View style={styles.topBar}>
            <Pressable onPress={() => navigation.goBack()} style={styles.roundBtn}>
              <Feather name="x" size={22} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => setFacing((p) => (p === 'back' ? 'front' : 'back'))}
              style={styles.roundBtn}
            >
              <MaterialIcons name="flip-camera-android" size={22} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>

        
        <View style={styles.bottomBar}>
          <Pressable onPress={handleCapture} style={styles.shutterOuter}>
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </CameraView>

   
      <Modal visible={showConfirm} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add photo to a trip</Text>

            {capturedUri ? (
              <Image source={{ uri: capturedUri }} style={styles.preview} />
            ) : null}

            <Text style={styles.label}>Destination</Text>
            <Pressable
              onPress={() => setDropdownOpen((o) => !o)}
              style={styles.dropdownBtn}
            >
              <Text style={styles.dropdownText}>{selectedLabel}</Text>
              <MaterialIcons
                name={dropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={22}
                color="#222"
              />
            </Pressable>

            {dropdownOpen && (
              <View style={styles.dropdownList}>
                {completed.length ? (
                  <FlatList
                    data={completed}
                    keyExtractor={(_, i) => String(i)}
                    renderItem={({ item, index }) => (
                      <TripRow item={item} index={index} />
                    )}
                  />
                ) : (
                  <Text style={{ padding: 12, color: '#666' }}>
                    No completed trips found.
                  </Text>
                )}
              </View>
            )}

            <View style={styles.rowButtons}>
              <Pressable onPress={cancelAdd} style={[styles.actionBtn, styles.secondary]}>
                <Text style={styles.actionTextSecondary}>Discard</Text>
              </Pressable>
              <Pressable onPress={confirmAdd} style={[styles.actionBtn, styles.primary]}>
                <Text style={styles.actionTextPrimary}>Add to Trip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  topBar: {
    marginTop: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 28,
    width: '100%',
    alignItems: 'center',
  },
  roundBtn: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 10,
    borderRadius: 999,
  },
  shutterOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  preview: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  label: { fontWeight: '600', marginBottom: 6 },
  dropdownBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: { fontSize: 16 },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginTop: 8,
    maxHeight: 220,
    overflow: 'hidden',
  },
  tripRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripRowSelected: { backgroundColor: '#3b82f6' },
  tripRowText: { fontSize: 16, color: '#222' },
  tripRowTextSelected: { color: '#fff' },
  rowButtons: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary: { backgroundColor: '#2563eb' },
  secondary: { backgroundColor: '#e5e7eb' },
  actionTextPrimary: { color: '#fff', fontWeight: '600' },
  actionTextSecondary: { color: '#111', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
