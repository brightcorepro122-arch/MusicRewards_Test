// Confetti animation for points celebration
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { THEME } from '../../constants/theme';

interface ConfettiAnimationProps {
  visible: boolean;
  onComplete: () => void;
  duration?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  visible,
  onComplete,
  duration = 2000,
}) => {
  const confettiRefs = useRef<Animated.Value[]>([]);
  const rotationRefs = useRef<Animated.Value[]>([]);

  // Create confetti pieces
  const confettiCount = 50;
  const colors = [THEME.colors.primary, THEME.colors.secondary, THEME.colors.accent, '#FF6B6B', '#4ECDC4'];

  useEffect(() => {
    if (visible) {
      // Initialize confetti pieces
      confettiRefs.current = Array.from({ length: confettiCount }, () => new Animated.Value(0));
      rotationRefs.current = Array.from({ length: confettiCount }, () => new Animated.Value(0));

      // Animate confetti
      const animations = confettiRefs.current.map((anim, index) => {
        const startX = Math.random() * screenWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = screenHeight + 100;
        const rotation = Math.random() * 720; // 2 full rotations

        return Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rotationRefs.current[index], {
            toValue: rotation,
            duration: duration + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.stagger(50, animations).start(() => {
        onComplete();
      });
    }
  }, [visible, duration, onComplete]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: confettiCount }, (_, index) => {
        const startX = Math.random() * screenWidth;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;

        return (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                backgroundColor: color,
                width: size,
                height: size,
                left: startX,
                transform: [
                  {
                    translateY: confettiRefs.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, screenHeight + 100],
                    }) || 0,
                  },
                  {
                    translateX: confettiRefs.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (Math.random() - 0.5) * 200],
                    }) || 0,
                  },
                  {
                    rotate: rotationRefs.current[index]?.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }) || '0deg',
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});


