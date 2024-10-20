import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { firestore } from '../config/FirebaseConfig';
import { doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { BASE_COLOR } from './Constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import Card from '../components/NutrientsCard'; // Import the MacroCard component

const Settings = ({ navigation }) => {
  const route = useRoute(); // Hook to access route parameters
  const { userId, caloriesBudget } = route.params;
  const [isEnabled, setIsEnabled] = useState(false);
  const [inputValue, setInputValue] = useState(caloriesBudget || 2000); // Separate input value state
  const [macros, setMacros] = useState({ carbs: 0, fats: 0, proteins: 0 }); // State to hold macro values

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const calculateMacros = (calories) => {
    const carbs = (calories * 0.50) / 4; // Carbs have 4 calories per gram
    const fats = (calories * 0.30) / 9; // Fats have 9 calories per gram
    const proteins = (calories * 0.20) / 4; // Proteins have 4 calories per gram
    setMacros({ carbs: Math.round(carbs), fats: Math.round(fats), proteins: Math.round(proteins) });
  };

  const handleSaveCalories = async () => {
    try {
      // Reference to the 'users' collection
      const usersCollection = collection(firestore, 'users');

      // Query to find the document where 'name' field equals the userId
      const userQuery = query(usersCollection, where('name', '==', userId));

      // Execute the query
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // Assuming there's only one document matching the query
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        // Update the caloriesBudget field in the user's document
        await updateDoc(userDocRef, {
          caloriesBudget: parseInt(inputValue, 10) || 0, // Update using inputValue
        });

        Alert.alert('Success', `Calories budget of ${inputValue} saved!`);
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Error', 'User not found');
      }
    } catch (error) {
      console.error('Error saving calories budget: ', error);
      Alert.alert('Error', 'Failed to save calories budget. Please try again.');
    }
  };

  const handleFocus = () => {
    setInputValue(''); // Clear input on focus
  };



  useEffect(() => {
    calculateMacros(inputValue);
  }, [inputValue]);

  return (
    <View style={styles.container}>
      {/* Row for Back Arrow and Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Example Switch Setting */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      {/* Calories Budget Input */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Calories Budget</Text>
        <TextInput
          style={styles.input}
          placeholder={`Currently ${caloriesBudget}`} // Show current value in placeholder
          placeholderTextColor="#A9A9A9" // Gray color for the placeholder
          keyboardType="numeric"
          onChangeText={text => setInputValue(text)} // Update inputValue directly
          onFocus={handleFocus} // Clear input on focus
        />
      </View>

      {/* Recommended Macronutrients in Card */}
      <Card title="Recommended Macronutrients">
        <Text style={styles.macroDetail}>Carbohydrates: {macros.carbs}g</Text>
        <Text style={styles.macroDetail}>Fats: {macros.fats}g</Text>
        <Text style={styles.macroDetail}>Proteins: {macros.proteins}g</Text>
      </Card>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveCalories}>
        <Text style={styles.saveText}>Save Calories Budget</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingText: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '50%',
    textAlign: 'right',
  },
  macroDetail: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Settings;
