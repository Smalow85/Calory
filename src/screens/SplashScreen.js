// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen ( { navigation }) {
  const opacity = useSharedValue(0);

  const letterAnimations = Array.from({ length: 8 }).map(() => ({
      width: useSharedValue(0),
      opacity: useSharedValue(0),
    }));

    // Animate the letters sequentially (left-to-right)
    useEffect(() => {
      letterAnimations.forEach((anim, index) => {
        setTimeout(() => {
          anim.width.value = withTiming(40, { duration: 500 });
          anim.opacity.value = withTiming(1, { duration: 500 });
        }, index * 150); // Delay each letter by 200ms
      });

      // Redirect to Home after all animations finish
      const timeout = setTimeout(() => {
        navigation.replace('screens/HomeScreen');
      }, 3000);

      return () => clearTimeout(timeout);
    }, []);


    // Array to render each letter with its animation
    const appName = "Calories".split('').map((letter, index) => {
      const animatedStyle = useAnimatedStyle(() => {
        return {
          width: letterAnimations[index].width.value, // Animate the width
          opacity: letterAnimations[index].opacity.value, // Animate the opacity
        };
      });

      return (
        <Animated.View key={index} style={[styles.letterContainer, animatedStyle]}>
          <Text style={styles.letter}>{letter}</Text>
        </Animated.View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          {appName}
        </View>
      </View>
    );
  };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  textContainer: {
    flexDirection: 'column',
  },
  letterContainer: {
    overflow: 'hidden', // Hide letter until fully revealed
  },
  letter: {
    fontSize: 62, // Increase font size for bigger letters
    fontWeight: 'thin',
    fontFamily: 'Roboto',
    color: '#000'
  },
});