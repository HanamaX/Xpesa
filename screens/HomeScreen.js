import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { VoiceContext } from '../context/VoiceContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  const { voiceEnabled } = useContext(VoiceContext);

  const handleNavigation = async (screenName, buttonText) => {
    try {
      if (voiceEnabled) {
        await Speech.speak(buttonText, { language: 'en-GB', rate: 0.75 });
        Alert.alert(
          "Confirmation",
          `Do you want to proceed to ${buttonText.split('.')[0]}?`,
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "OK",
              onPress: async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                navigation.navigate(screenName);
              }
            }
          ]
        );
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate(screenName);
      }
    } catch (error) {
      console.error("TTS or Navigation Error:", error);
      Alert.alert("Error", "Failed to navigate or speak.");
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.balanceBox}>
        <Text style={styles.balanceText}>Available Balance</Text>
        <Text style={styles.balanceAmount}>$1,234.56</Text>
      </View>
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => handleNavigation('SendMoney', 'Send Money. Tap to proceed.')}
          accessible={true}
          accessibilityLabel="Send Money"
        >
          <Icon name="send" size={30} color="#FFF" />
          <Text style={styles.gridItemText}>Send Money</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => handleNavigation('PayBills', 'Pay Bills. Tap to proceed.')}
          accessible={true}
          accessibilityLabel="Pay Bills"
        >
          <Icon name="file-text" size={30} color="#FFF" />
          <Text style={styles.gridItemText}>Pay Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => handleNavigation('CashOut', 'Cash Out. Tap to proceed.')}
          accessible={true}
          accessibilityLabel="Cash Out"
        >
          <Icon name="money" size={30} color="#FFF" />
          <Text style={styles.gridItemText}>Cash Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => handleNavigation('BuyAirtime', 'Buy Airtime. Tap to proceed.')}
          accessible={true}
          accessibilityLabel="Buy Airtime"
        >
          <Icon name="mobile" size={30} color="#FFF" />
          <Text style={styles.gridItemText}>Buy Airtime</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => handleNavigation('TransactionHistory', 'Transaction History. Tap to proceed.')}
          accessible={true}
          accessibilityLabel="Transaction History"
        >
          <Icon name="history" size={30} color="#FFF" />
          <Text style={styles.gridItemText}>Transaction History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => handleNavigation('Settings', 'Settings. Tap to proceed.')}
          accessible={true}
          accessibilityLabel="Settings"
        >
          <Icon name="cogs" size={30} color="#FFF" />
          <Text style={styles.gridItemText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  balanceBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  balanceText: {
    fontSize: 18,
    color: '#333',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#007AFF', // Accessible blue
    padding: 20, // Large padding for easy tapping
    borderRadius: 10,
    marginBottom: 20,
    width: '45%', // Two items per row
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  gridItemText: {
    color: '#FFF',
    fontSize: 16, // Font size for grid items
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HomeScreen;