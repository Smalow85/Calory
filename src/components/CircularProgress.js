import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PROGRESS_RING_COLOR } from '../screens/Constants';

const { width } = Dimensions.get('window');

export default function CircularProgress({ currentValue, maxValue, radius }) {
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  // Use state for animated progress
  const [progress, setProgress] = useState(0);
  const percentage = Math.min((currentValue / maxValue) * 100, 100);

  const strokeColor = currentValue >= maxValue ? '#FF0000' : PROGRESS_RING_COLOR; // Red if over, green otherwise

  useEffect(() => {
    let animationFrame;
    const animateProgress = () => {
      if (progress < percentage) {
        setProgress((prev) => Math.min(prev + 1, percentage)); // Animate incrementally
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };
    animateProgress();

    return () => cancelAnimationFrame(animationFrame); // Cleanup animation on unmount
  }, [percentage]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={200} height={200} viewBox="0 0 200 200">
        {/* Background Circle */}
        <Circle
          stroke="#E6E6E6"
          fill="none"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Foreground Circle */}
        <Circle
          stroke={strokeColor}
          fill="none"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 100 100)`} // Rotate for progress to start at top
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.currentValue}>{currentValue}</Text>
        <Text style={styles.label}>Calories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  currentValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#777',
  },
});
