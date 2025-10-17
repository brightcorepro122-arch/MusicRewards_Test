// AnimatedVisualizer - Animated music visualizer component
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { THEME } from '../../constants/theme';

interface AnimatedVisualizerProps {
  isPlaying: boolean;
  intensity?: number; // 0-1, affects animation intensity
  bars?: number; // Number of bars to display
  color?: string;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const AnimatedVisualizer: React.FC<AnimatedVisualizerProps> = ({
  isPlaying,
  intensity = 0.5,
  bars = 8,
  color = THEME.colors.primary,
  height = 100,
}) => {
  const animatedValues = useRef(
    Array.from({ length: bars }, () => new Animated.Value(0.1))
  ).current;

  useEffect(() => {
    if (isPlaying) {
      const animations = animatedValues.map((animatedValue, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 0.1 + (Math.random() * intensity * 0.9),
              duration: 100 + Math.random() * 200,
              useNativeDriver: false,
            }),
            Animated.timing(animatedValue, {
              toValue: 0.1 + (Math.random() * intensity * 0.9),
              duration: 100 + Math.random() * 200,
              useNativeDriver: false,
            }),
          ])
        );
      });

      // Stagger the animations for a more natural effect
      animations.forEach((animation, index) => {
        setTimeout(() => animation.start(), index * 50);
      });

      return () => {
        animations.forEach(animation => animation.stop());
      };
    } else {
      // Fade out all bars when not playing
      Animated.parallel(
        animatedValues.map(animatedValue =>
          Animated.timing(animatedValue, {
            toValue: 0.1,
            duration: 300,
            useNativeDriver: false,
          })
        )
      ).start();
    }
  }, [isPlaying, intensity, animatedValues]);

  const barWidth = (screenWidth - 40) / bars - 4; // Account for margins and spacing

  return (
    <View style={[styles.container, { height }]}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              width: barWidth,
              height: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [height * 0.1, height * 0.9],
              }),
              backgroundColor: color,
              opacity: animatedValue.interpolate({
                inputRange: [0, 0.1, 1],
                outputRange: [0.3, 0.3, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  bar: {
    marginHorizontal: 2,
    borderRadius: 2,
  },
});
