import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MealCard = ({ meal }) => {

  const base64ImageUri = `data:image/jpg;base64,${meal.base64image}`; // Assuming meal.iconBase64 contains the base64 string

  return (
    <View style={styles.card}>
      {/* Food type icon */}
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: base64ImageUri }} // Assuming the meal object contains an icon URI
          style={styles.icon}
        />
      </View>

      {/* Meal info section */}
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal.dish_type}</Text>
        <Text style={styles.mealDescription}>{meal.short_description}</Text>
        <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.1, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
    elevation: 3, // For Android shadow
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0', // Placeholder color for the icon
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20, // Rounded icon
  },
  mealInfo: {
    flex: 1, // Allow meal info to take up remaining space
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 14,
    color: '#888',
  },
});

export default MealCard;