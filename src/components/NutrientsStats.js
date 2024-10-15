// NutrientStats.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import HorizontalProgressBar from './HorizontalProgressBar';

const NutrientStats = ({ fats, proteins, carbohydrates }) => {
  return (
    <View style={styles.container}>
      <HorizontalProgressBar
        currentValue={fats}
        maxValue={100}
        label="Fats"
        color="#FF6347" // Example color for fats
      />
      <HorizontalProgressBar
        currentValue={proteins}
        maxValue={100}
        label="Proteins"
        color="#4CAF50" // Example color for proteins
      />
      <HorizontalProgressBar
        currentValue={carbohydrates}
        maxValue={100}
        label="Carbohydrates"
        color="#2196F3" // Example color for carbohydrates
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //padding: 20,
    width: '100%',
  },
});

export default NutrientStats;
