// HorizontalProgressBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const HorizontalProgressBar = ({ currentValue, maxValue, label, color }) => {
  const percentage = Math.min((currentValue / maxValue) * 100, 100);
  const width = percentage;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.progressContainer}>
        <Svg height="20" width="100%">
          <Rect
            width={width + '%'}
            height="100%"
            fill={color}
          />
          <Rect
            x={width + '%'}
            width={100 - width + '%'}
            height="100%"
            fill="#E6E6E6" // Background color for the remaining part
          />
        </Svg>
      </View>
      <Text style={styles.value}>
        {currentValue}/{maxValue} ({percentage.toFixed(0)}%)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressContainer: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  value: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 14,
  },
});

export default HorizontalProgressBar;
