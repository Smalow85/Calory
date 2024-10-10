import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PROGRESS_RING_COLOR } from '../screens/Constants'

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress ({ currentValue, maxValue }) {
  const radius = 90;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  const percentage = Math.min((currentValue / maxValue) * 100, 100);

  const strokeColor = currentValue >= maxValue ? '#FF0000' : PROGRESS_RING_COLOR; // Red if over, green otherwise

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [currentValue]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - (progress.value / 100) * circumference,
    };
  });

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
        {/* Foreground Animated Circle */}
        <AnimatedCircle
          animatedProps={animatedProps}
          stroke={strokeColor}
          fill="none"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 100 100)`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.currentValue}>{currentValue}</Text>
        <Text style={styles.label}>Calories</Text>
      </View>
    </View>
  );
};

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
