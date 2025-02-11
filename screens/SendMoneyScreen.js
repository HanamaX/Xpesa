import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Keyboard, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { VoiceContext } from '../context/VoiceContext';
import { LinearGradient } from 'expo-linear-gradient';

const SendMoneyScreen = ({ navigation }) => {
  const { voiceEnabled } = useContext(VoiceContext);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const availableBalance = 1234.56;

  useEffect(() => {
    if (voiceEnabled) {
      // Initial voice prompt
      Speech.speak('You are on the Send Money screen. Enter recipient and amount.');
    }

    // Clean up Speech when the component unmounts
    return () => {
      Speech.stop();
    };
  }, [voiceEnabled]);

  const handleSendMoney = async () => {
    if (!recipient || !amount) {
      const message = 'Please enter both recipient and amount.';
      if (voiceEnabled) {
        await Speech.speak(message);
      }
      Alert.alert('Incomplete Information', message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // Error haptic
      return;
    }

    // Basic validation (you'd have more robust validation in a real app)
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      const message = 'Invalid amount. Please enter a valid number.';
      if (voiceEnabled) {
        await Speech.speak(message);
      }
      Alert.alert('Invalid Amount', message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (amountValue > availableBalance) {
      const message = 'The amount exceeds the available balance.';
      if (voiceEnabled) {
        await Speech.speak(message);
      }
      Alert.alert('Insufficient Balance', message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      const confirmationMessage = `Confirm sending ${amount} to ${recipient}?`;
      if (voiceEnabled) {
        await Speech.speak(confirmationMessage);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert(
        'Confirm Send Money',
        confirmationMessage,
        [
          {
            text: 'Cancel',
            onPress: async () => {
              if (voiceEnabled) {
                await Speech.speak('Transaction cancelled.');
              }
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            },
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              console.log(`Sending ${amount} to ${recipient}`);
              if (voiceEnabled) {
                await Speech.speak(`Successfully sent ${amount} to ${recipient}.`);
              }
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

              setRecipient('');
              setAmount('');
              Keyboard.dismiss();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error sending money:', error);
      const errorMessage = 'Failed to send money. Please try again later.';
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
        <Text style={styles.label}>Recipient:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number or contact"
          placeholderTextColor="#AAA"
          value={recipient}
          onChangeText={(text) => {
            setRecipient(text);
            if (voiceEnabled) {
              Speech.speak(`Recipient: ${text}`);  // Read out as they type
            }
          }}
          keyboardType="phone-pad"
          accessible={true}
          accessibilityLabel="Recipient Input"
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
              Speech.speak(`Amount: ${text}`); // Read out as they type
            }
          }}
          keyboardType="numeric"
          accessible={true}
          accessibilityLabel="Amount Input"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendMoney}
          accessible={true}
          accessibilityLabel="Send Money Button"
        >
          <Text style={styles.buttonText}>Send Money</Text>
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
});

export default SendMoneyScreen;