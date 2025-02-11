import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { VoiceContext } from '../context/VoiceContext';
import { LinearGradient } from 'expo-linear-gradient';

const CashOutScreen = () => {
  const { voiceEnabled } = useContext(VoiceContext);

  const [amount, setAmount] = useState('');
  const [agentNumber, setAgentNumber] = useState('');
  const [nearbyAgents, setNearbyAgents] = useState([]);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    if (voiceEnabled) {
      Speech.speak('You are on the Cash Out screen. Enter amount and, optionally, agent number, or find nearby agents.');
    }

    getLocationPermission();
    return () => {
      if (voiceEnabled) {
        Speech.stop();
      }
    };
  }, [voiceEnabled]);

  const getLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      if (status !== 'granted') {
        if (voiceEnabled) {
          await Speech.speak('Permission to access location was denied.');
        }
        Alert.alert('Permission Denied', 'Location access is required to find nearby agents.');
        return;
      }
      if (voiceEnabled) {
        await Speech.speak('Location permission granted.');
      }
    } catch (error) {
      console.error("Error getting location permission:", error);
      if (voiceEnabled) {
        await Speech.speak('Error getting location permission.');
      }
      Alert.alert('Error', 'Failed to get location permission.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const findNearbyAgents = async () => {
    if (locationPermission !== 'granted') {
      if (voiceEnabled) {
        await Speech.speak('Location permission is required to find nearby agents.');
      }
      Alert.alert('Permission Denied', 'Please grant location permission in settings.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      if (voiceEnabled) {
        await Speech.speak('Finding nearby agents. Please wait.');
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const simulatedAgents = [
        { id: '1', name: 'Agent A', distance: 0.5, latitude: latitude + 0.001, longitude: longitude + 0.001, agentNumber: '12345' },
        { id: '2', name: 'Agent B', distance: 1.2, latitude: latitude - 0.002, longitude: longitude - 0.002, agentNumber: '67890' },
        { id: '3', name: 'Agent C', distance: 2.1, latitude: latitude + 0.003, longitude: longitude + 0.001, agentNumber: '54321' },
      ];

      setNearbyAgents(simulatedAgents);
      if (voiceEnabled) {
        await Speech.speak(`Found ${simulatedAgents.length} nearby agents.`);
      }
    } catch (error) {
      console.error('Error finding nearby agents:', error);
      if (voiceEnabled) {
        await Speech.speak('Failed to find nearby agents. Please check your location services and try again.');
      }
      Alert.alert('Error', 'Failed to find nearby agents.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleCashOut = async () => {
    if (!amount) {
      const message = 'Please enter the amount to cash out.';
      if (voiceEnabled) {
        await Speech.speak(message);
      }
      Alert.alert('Incomplete Information', message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (isNaN(parseFloat(amount))) {
      const message = 'Invalid amount. Please enter a valid number.';
      if (voiceEnabled) {
        await Speech.speak(message);
      }
      Alert.alert('Invalid Amount', message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    let agentNameToUse = agentNumber;

    if (!agentNumber && nearbyAgents.length > 0) {
      agentNameToUse = nearbyAgents[0].name;
    } else if (!agentNumber) {
      const message = 'Please enter an agent number, or find nearby agents.';
      if (voiceEnabled) {
        await Speech.speak(message);
      }
      Alert.alert('Agent Required', message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      const confirmationMessage = `Confirm cashing out ${amount} with agent ${agentNameToUse}?`;
      if (voiceEnabled) {
        await Speech.speak(confirmationMessage);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert(
        'Confirm Cash Out',
        confirmationMessage,
        [
          {
            text: 'Cancel',
            onPress: async () => {
              if (voiceEnabled) {
                await Speech.speak('Cash out cancelled.');
              }
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            },
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              console.log(`Cashing out ${amount} with agent ${agentNameToUse}`);
              if (voiceEnabled) {
                await Speech.speak(`Successfully cashed out ${amount} with agent ${agentNameToUse}.`);
              }
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

              setAmount('');
              setAgentNumber('');
              Keyboard.dismiss();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error cashing out:', error);
      const errorMessage = 'Failed to cash out. Please try again later.';
      if (voiceEnabled) {
        await Speech.speak(errorMessage);
      }
      Alert.alert('Error', errorMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#AAA"
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
            if (voiceEnabled) {
              Speech.speak(`Amount: ${text}`);
            }
          }}
          keyboardType="numeric"
          accessible={true}
          accessibilityLabel="Amount Input"
        />

        <Text style={styles.label}>Agent Number (Optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter agent number"
          placeholderTextColor="#AAA"
          value={agentNumber}
          onChangeText={(text) => {
            setAgentNumber(text);
            if (voiceEnabled) {
              Speech.speak(`Agent Number: ${text}`);
            }
          }}
          keyboardType="numeric"
          accessible={true}
          accessibilityLabel="Agent Number Input"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={findNearbyAgents}
          accessible={true}
          accessibilityLabel="Find Nearby Agents Button"
        >
          <Text style={styles.buttonText}>Find Nearby Agents</Text>
        </TouchableOpacity>

        {nearbyAgents.length > 0 && (
          <View style={styles.agentsContainer}>
            <Text style={styles.agentsHeader}>Nearby Agents:</Text>
            {nearbyAgents.map((agent) => (
              <View key={agent.id} style={styles.agentItem}>
                <Text style={styles.agentText}>{agent.name} ({agent.distance.toFixed(2)} km) - {agent.agentNumber}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleCashOut}
          accessible={true}
          accessibilityLabel="Cash Out Button"
        >
          <Text style={styles.buttonText}>Cash Out</Text>
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
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 18,
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
  agentsContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
  },
  agentsHeader: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  agentItem: {
    marginBottom: 5,
  },
  agentText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default CashOutScreen;