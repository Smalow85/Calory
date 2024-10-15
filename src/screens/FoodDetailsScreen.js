import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addMeal } from '../service/MealDataService'

const FoodDetailsScreen = ({ route }) => {
      const { userId, imageUri } = route.params;
      const [modalVisible, setModalVisible] = useState(true); // State for modal visibility
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [successMessage, setSuccessMessage] = useState('');
      const navigation = useNavigation();
    // Function to send meal data to backend
  const sendMealData = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
    console.log(userId)
      // Only send the user ID
      const response = await fetch('http://localhost:3000/api/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }), // Send only user ID
      });

      if (!response.ok) {
        throw new Error('Failed to send meal data');
      }

      const data = await response.json();
      setSuccessMessage('Meal data sent successfully!'); // Show success message
      console.log('Response from server:', data);
      navigation.navigate('HomeScreen') // Log the response from your server
      addMeal(data);
    } catch (err) {
      setError(err.message); // Set error message if request fails
      console.error('Error sending meal data:', err);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {
/* Modal to show the selected image */
}
      <Modal
        animationType="slide"
        transparent={true} // Transparent modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          {
/* Close button */
}
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => { setModalVisible(false); navigation.navigate('HomeScreen'); }}>
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>

          {
/* Stylish photo frame with rounded corners */
}
          <View style={styles.imageFrame}>
            <Image source={{ uri: imageUri }} style={styles.modalImage} />
          </View>

          {
/* Send button */
}
          <TouchableOpacity style={styles.sendButton} onPress={sendMealData}>
            <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent', // Fully transparent modal background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  imageFrame: {
    width: '80%',
    borderRadius: 20, // Rounded corners for the frame
    overflow: 'hidden', // Ensure the image respects the border radius
    marginBottom: 20, // Space below the image
  },
  modalImage: {
    width: '100%', // Image takes full width of frame
    height: 300, // Set image height
    resizeMode: 'cover', // Cover to fill the frame
    borderRadius: 20, // Rounded corners for the image
  },
  sendButton: {
    backgroundColor: '#006A6A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // Rounded button
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodDetailsScreen;

