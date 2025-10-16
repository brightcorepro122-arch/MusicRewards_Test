// Simple audio visualizer component
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../constants/theme';

interface AudioVisualizerProps {
  isPlaying: boolean;
  intensity?: number; // 0-1
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  intensity = 0.5,
  barCount = 20,
}) => {
  const animatedValues = useRef<Animated.Value[]>([]);

  useEffect(() => {
    // Initialize animated values
    animatedValues.current = Array.from({ length: barCount }, () => new Animated.Value(0.1));
  }, [barCount]);

  useEffect(() => {
    if (isPlaying) {
      // Create random animation for each bar
      const animations = animatedValues.current.map((anim, index) => {
        const delay = index * 50;
        const duration = 200 + Math.random() * 300;
        const toValue = 0.1 + Math.random() * intensity * 0.9;

        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.1,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
      });

      Animated.parallel(animations).start();
    } else {
      // Stop animations and reset to low values
      animatedValues.current.forEach((anim) => {
        anim.stopAnimation();
        Animated.timing(anim, {
          toValue: 0.1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isPlaying, intensity]);

  return (
    <View style={styles.container}>
      {Array.from({ length: barCount }, (_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: animatedValues.current[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 40],
              }) || 4,
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
    height: 50,
    paddingHorizontal: THEME.spacing.md,
  },
  bar: {
    width: 3,
    backgroundColor: THEME.colors.accent,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
});



