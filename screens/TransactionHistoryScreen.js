import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { VoiceContext } from '../context/VoiceContext';
import { LinearGradient } from 'expo-linear-gradient';

const TransactionHistoryScreen = () => {
  const { voiceEnabled } = useContext(VoiceContext);
  const [transactions, setTransactions] = useState([]);

  // Simulate fetching transaction history (replace with your API call)
  useEffect(() => {
    if (voiceEnabled) {
      Speech.speak('You are on the Transaction History screen. Here are your recent transactions.');
    }
    const simulatedTransactions = [
      { id: '1', type: 'Send Money', amount: 50, recipient: 'John Doe', date: '2023-11-19', time: '10:00 AM' },
      { id: '2', type: 'Pay Bill', amount: 25, recipient: 'Electricity Company', date: '2023-11-18', time: '02:30 PM' },
      { id: '3', type: 'Cash Out', amount: 100, recipient: 'Agent A', date: '2023-11-17', time: '05:15 PM' },
      { id: '4', type: 'Buy Airtime', amount: 10, recipient: 'Self', date: '2023-11-16', time: '08:45 AM' },
      { id: '5', type: 'Send Money', amount: 50, recipient: 'John Doe', date: '2023-11-19', time: '10:00 AM' },
      { id: '6', type: 'Pay Bill', amount: 25, recipient: 'Electricity Company', date: '2023-11-18', time: '02:30 PM' },
    ];
    setTransactions(simulatedTransactions);
    return () => {
      Speech.stop();
    };
  }, [voiceEnabled]);

  const readTransactionDetails = async (item) => {
    if (voiceEnabled) {
      const details = `Transaction ID ${item.id}: ${item.type} of ${item.amount} to ${item.recipient} on ${item.date} at ${item.time}.`;
      await Speech.speak(details);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => readTransactionDetails(item)}
      accessible={true}
      accessibilityLabel={`Transaction: ${item.type} of ${item.amount} to ${item.recipient} on ${item.date} at ${item.time}`}
    >
      <Text style={styles.transactionText}>{item.type}</Text>
      <Text style={styles.transactionText}>Amount: ${item.amount}</Text>
      <Text style={styles.transactionText}>Recipient: {item.recipient}</Text>
      <Text style={styles.transactionText}>Date: {item.date}</Text>
      <Text style={styles.transactionText}>Time: {item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <FlatList
        data={[{ key: 'header' }, ...transactions]}
        renderItem={({ item }) => {
          if (item.key === 'header') {
            return <Text style={styles.header}>Transaction History</Text>;
          }
          return renderItem({ item });
        }}
        keyExtractor={(item) => item.id || item.key}
        contentContainerStyle={styles.scrollContainer}
      />
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
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionList: {
    marginBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  transactionText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default TransactionHistoryScreen;