import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Keyboard, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { VoiceContext } from '../context/VoiceContext';
import { LinearGradient } from 'expo-linear-gradient';

const PayBillsScreen = () => {
  const { voiceEnabled } = useContext(VoiceContext);

  const [biller, setBiller] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBiller, setSelectedBiller] = useState(null);

  const billers = [
    { id: '1', name: 'Electricity Company', shortName: 'EC' },
    { id: '2', name: 'Water Utility', shortName: 'WU' },
    { id: '3', name: 'Internet Provider', shortName: 'IP' },
    { id: '4', name: 'Cable TV', shortName: 'CTV' },
  ];

  useEffect(() => {
    if (voiceEnabled) {
      Speech.speak('You are on the Pay Bills screen. Select a biller or enter details.');
    }
    return () => {
      Speech.stop();
    };
  }, [voiceEnabled]);

  const handleSelectBiller = async (biller) => {
    setSelectedBiller(biller);
    setBiller(biller.name);
    if (voiceEnabled) {
      await Speech.speak(`Selected ${biller.name}. Enter account number and amount.`);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePayBill = async () => {
    if (!biller || !accountNumber || !amount) {
      const message = 'Please enter biller, account number, and amount.';
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

    try {
      const confirmationMessage = `Confirm paying ${amount} to ${biller} for account ${accountNumber}?`;
      if (voiceEnabled) {
        await Speech.speak(confirmationMessage);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert(
        'Confirm Payment',
        confirmationMessage,
        [
          {
            text: 'Cancel',
            onPress: async () => {
              if (voiceEnabled) {
                await Speech.speak('Payment cancelled.');
              }
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            },
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              console.log(`Paying ${amount} to ${biller} (${accountNumber})`);
              if (voiceEnabled) {
                await Speech.speak(`Successfully paid ${amount} to ${biller}.`);
              }
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setBiller('');
              setAccountNumber('');
              setAmount('');
              setSelectedBiller(null);
              Keyboard.dismiss();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error paying bill:', error);
      const errorMessage = 'Failed to pay bill. Please try again later.';
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
        <Text style={styles.label}>Select Biller:</Text>
        <ScrollView style={styles.billerList} nestedScrollEnabled={true}>
          {billers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.billerItem,
                selectedBiller?.id === item.id && styles.selectedBillerItem,
              ]}
              onPress={() => handleSelectBiller(item)}
              accessible={true}
              accessibilityLabel={`Biller: ${item.name}`}
            >
              <Text style={styles.billerName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.label}>OR Enter Biller:</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter biller name"
          placeholderTextColor="#AAA"
          value={biller}
          onChangeText={(text) => {
            setBiller(text);
            if (voiceEnabled) {
              Speech.speak(`Biller: ${text}`);
            }
            setSelectedBiller(null);
          }}
          accessible={true}
          accessibilityLabel="Biller Input"
        />

        <Text style={styles.label}>Account Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter account number"
          placeholderTextColor="#AAA"
          value={accountNumber}
          onChangeText={(text) => {
            setAccountNumber(text);
            if (voiceEnabled) {
              Speech.speak(`Account Number: ${text}`);
            }
          }}
          keyboardType="numeric"
          accessible={true}
          accessibilityLabel="Account Number Input"
        />

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

        <TouchableOpacity
          style={styles.button}
          onPress={handlePayBill}
          accessible={true}
          accessibilityLabel="Pay Bill Button"
        >
          <Text style={styles.buttonText}>Pay Bill</Text>
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
  billerList: {
    marginBottom: 20,
    maxHeight: 150,
  },
  billerItem: {
    backgroundColor: '#444',
    padding: 15,
    marginBottom: 5,
    borderRadius: 5,
  },
  selectedBillerItem: {
    borderColor: '#FFF',
    borderWidth: 2,
  },
  billerName: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default PayBillsScreen;