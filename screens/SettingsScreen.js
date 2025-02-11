import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { VoiceContext } from '../context/VoiceContext';
import { LinearGradient } from 'expo-linear-gradient';

const SettingsScreen = ({ navigation }) => {
  const { voiceEnabled, setVoiceEnabled } = useContext(VoiceContext);
  const [hapticIntensity, setHapticIntensity] = useState(2); // Default to Medium

  useEffect(() => {
    // Get Available Voices
    const getVoices = async () => {
      let voices = await Speech.getAvailableVoicesAsync();
      if (voices && voices.length > 0) {
        Speech.setDefaultVoice(voices[0].identifier);
      }
    };
    getVoices();
    if (voiceEnabled) {
      Speech.speak('You are on the Settings screen. You can adjust preferences.');
    }

    return () => {
      Speech.stop();
    };
  }, [voiceEnabled]);

  const toggleVoice = async (value) => {
    setVoiceEnabled(value);
    if (value) {
      Speech.speak('Voice enabled.');
    } else {
      Speech.stop();
      Alert.alert('Voice disabled.');
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real app, you'd likely persist this setting (e.g., using AsyncStorage)
  };

  const handleHapticIntensityChange = (value) => {
    setHapticIntensity(value);
    if (voiceEnabled) {
      Speech.speak(`Haptic intensity set to ${value === 1 ? 'Low' : value === 2 ? 'Medium' : 'High'}.`);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const confirmChanges = () => {
    Alert.alert(
      'Confirm Changes',
      'Do you want to save these settings?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            if (voiceEnabled) {
              Speech.speak('Changes cancelled.');
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            if (voiceEnabled) {
              Speech.speak('Settings saved.');
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.navigate('Home');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Voice Assistance:</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleVoice(!voiceEnabled)}
          accessible={true}
          accessibilityLabel="Toggle Voice Assistance"
        >
          <Text style={styles.buttonText}>{voiceEnabled ? 'Disable Voice' : 'Enable Voice'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Haptic Intensity:</Text>
        <View style={styles.hapticContainer}>
          <TouchableOpacity
            style={[styles.hapticButton, hapticIntensity === 1 && styles.selectedHapticButton]}
            onPress={() => handleHapticIntensityChange(1)}
            accessible={true}
            accessibilityLabel="Set Haptic Intensity to Low"
          >
            <Text style={styles.hapticButtonText}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hapticButton, hapticIntensity === 2 && styles.selectedHapticButton]}
            onPress={() => handleHapticIntensityChange(2)}
            accessible={true}
            accessibilityLabel="Set Haptic Intensity to Medium"
          >
            <Text style={styles.hapticButtonText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hapticButton, hapticIntensity === 3 && styles.selectedHapticButton]}
            onPress={() => handleHapticIntensityChange(3)}
            accessible={true}
            accessibilityLabel="Set Haptic Intensity to High"
          >
            <Text style={styles.hapticButtonText}>High</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={confirmChanges}
          accessible={true}
          accessibilityLabel="Confirm Changes"
        >
          <Text style={styles.buttonText}>Confirm Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hapticContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  hapticButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedHapticButton: {
    borderColor: '#FFF',
    borderWidth: 2,
  },
  hapticButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default SettingsScreen;