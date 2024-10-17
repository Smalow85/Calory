import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { addMeal } from '../service/MealDataService';

const FoodDetailsScreen = ({ route }) => {
  const { userId, imageUri } = route.params;
  const [modalVisible, setModalVisible] = useState(true); // State for modal visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();

  const sendImage = async () => {
    if (!imageUri) {
      setError('No image selected');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('userId', userId);

      if (Platform.OS === 'web') {
        // For web, fetch the image as a blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      } else {
        // For React Native
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }

      const response = await fetch('http://localhost:8080/api/analyze-meal', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send meal data');
      }

      const data = await response.json();
      setSuccessMessage('Meal data sent successfully!');
      console.log('Response from server:', data);
      addMeal(data)

    } catch (err) {
      setError(err.message);
      console.error('Error sending meal data:', err);
    } finally {
      navigation.navigate('HomeScreen');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal
        animationType="slide"
        transparent={true} // Transparent modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => { setModalVisible(false); navigation.navigate('HomeScreen'); }}>
            <Icon name="close" size={30} color="black" />
          </TouchableOpacity>

          <View style={styles.imageFrame}>
            <Image source={{ uri: imageUri }} style={styles.modalImage} />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={sendImage}>
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
    backgroundColor: 'transparent',
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
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: '#006A6A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
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
