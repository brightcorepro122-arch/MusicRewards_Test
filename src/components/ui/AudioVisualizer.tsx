// AudioVisualizer component - Visual representation of audio
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../constants/theme';
import type { AudioVisualizerProps } from '../../types';

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  bars = 20,
  color = THEME.colors.primary,
}) => {
  const animatedValues = useRef(
    Array.from({ length: bars }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (isPlaying) {
      const animations = animatedValues.map((value, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 200 + Math.random() * 300,
              useNativeDriver: false,
            }),
            Animated.timing(value, {
              toValue: 0.3,
              duration: 200 + Math.random() * 300,
              useNativeDriver: false,
            }),
          ])
        )
      );

      Animated.parallel(animations).start();
    } else {
      // Reset all bars to minimum height
      Animated.parallel(
        animatedValues.map(value =>
          Animated.timing(value, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: false,
          })
        )
      ).start();
    }
  }, [isPlaying, animatedValues]);

  return (
    <View style={styles.container}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              height: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['20%', '100%'],
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: THEME.spacing.md,
  },
  bar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
    minHeight: 12,
  },
});
