import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { VoiceContext } from '../context/VoiceContext';
import { LinearGradient } from 'expo-linear-gradient';

const BuyAirtimeScreen = ({ navigation }) => {
  const { voiceEnabled } = useContext(VoiceContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const networks = [
    { id: '1', name: 'Airtel' },
    { id: '2', name: 'Yas' },
    { id: '3', name: 'Vodacom' },
    // Add more networks as needed
  ];

  const handleSelectNetwork = (network) => {
    setSelectedNetwork(network);
    if (voiceEnabled) {
      Speech.speak(`Selected Network: ${network.name}`);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <Text style={styles.label}>Select Network:</Text>
      <View style={styles.networkList}>
        {networks.map((network) => (
          <TouchableOpacity
            key={network.id}
            style={[
              styles.networkItem,
              selectedNetwork?.id === network.id && styles.selectedNetworkItem,
            ]}
            onPress={() => handleSelectNetwork(network)}
            accessible={true}
            accessibilityLabel={`Network: ${network.name}`}
          >
            <LinearGradient
              colors={selectedNetwork?.id === network.id ? ['#005BB5', '#007AFF'] : ['#007AFF', '#005BB5']}
              style={styles.networkGradient}
            >
              <Text style={styles.networkName}>{network.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        placeholderTextColor="#AAA"
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          if (voiceEnabled) {
            Speech.speak(`Phone Number: ${text}`);
          }
        }}
        keyboardType="phone-pad"
        accessible={true}
        accessibilityLabel="Phone Number Input"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Handle the buy airtime action
          if (voiceEnabled) {
            Speech.speak('Airtime purchased successfully.');
          }
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert('Success', 'Airtime purchased successfully.');
        }}
        accessible={true}
        accessibilityLabel="Buy Airtime Button"
      >
        <Text style={styles.buttonText}>Buy Airtime</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  networkList: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft:40
  },
  networkItem: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  networkGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedNetworkItem: {
    borderColor: '#FFF',
    borderWidth: 2,
  },
  networkName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default BuyAirtimeScreen;