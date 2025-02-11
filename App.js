import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import PayBillsScreen from './screens/PayBillsScreen';
import CashOutScreen from './screens/CashOutScreen';
import BuyAirtimeScreen from './screens/BuyAirtimeScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import * as Haptics from 'expo-haptics'; // Import Haptics
import { VoiceProvider } from './context/VoiceContext';

const Stack = createStackNavigator();

const App = () => {
  return (
  <VoiceProvider>
  <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Group 15 AI Money App' }} />
          <Stack.Screen name="SendMoney" component={SendMoneyScreen} options={{ title: 'Send Money' }} />
          <Stack.Screen name="PayBills" component={PayBillsScreen} options={{ title: 'Pay Bills' }} />
          <Stack.Screen name="CashOut" component={CashOutScreen} options={{ title: 'Cash Out' }} />
          <Stack.Screen name="BuyAirtime" component={BuyAirtimeScreen} options={{ title: 'Buy Airtime' }} />
          <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} options={{ title: 'Transaction History' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  </VoiceProvider>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background
  },
});

export default App;
