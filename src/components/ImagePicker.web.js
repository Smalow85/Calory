import React from 'react';
import { Button, View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { addMeal } from '../service/MealDataService'

const ImagePickerComponent = (user_id) => {

  const openGallery = () => {
        document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file: ', file);
            const mealData = {
                      user_id: user_id.user_id, // Replace with actual user ID
                      dish_type: "dinner",
                      short_description: "Grilled Salmon with Asparagus",
                      calories: 450, // Estimated calories
                      ingredients: ["Salmon", "Asparagus", "Cherry Tomatoes", "Lemon"],
                      proteins: 40, // Total protein in grams
                      fats: 25, // Total fat in grams
                      carbohydrates: 8 // Total carbs in grams
                    };
            addMeal(mealData);
        }
  };

  return (
    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Text style={styles.buttonText}>Add Photo</Text>
        </TouchableOpacity>
        {<input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
        }
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Open Gallery</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      paddingBottom: 32,
    },
    button: {
      flex: 1,
      backgroundColor: '#006A6A',
      paddingVertical: 16,
      borderRadius: 12,
      marginHorizontal: 6,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#006A6A',
    },
    secondaryButtonText: {
      color: '#006A6A',
    }
});

export default ImagePickerComponent;