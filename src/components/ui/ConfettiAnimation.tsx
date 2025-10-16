// ConfettiAnimation component - Celebration animation
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { THEME } from '../../constants/theme';
import type { ConfettiAnimationProps } from '../../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  isVisible,
  onComplete,
  colors = [THEME.colors.primary, THEME.colors.secondary, THEME.colors.accent],
}) => {
  const confettiPieces = useRef(
    Array.from({ length: 50 }, (_, index) => ({
      id: index,
      x: new Animated.Value(Math.random() * screenWidth),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(1),
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  ).current;

  useEffect(() => {
    if (isVisible) {
      // Start confetti animation
      const animations = confettiPieces.map((piece) => {
        return Animated.parallel([
          Animated.timing(piece.y, {
            toValue: screenHeight + 100,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: false,
          }),
          Animated.timing(piece.rotation, {
            toValue: Math.random() * 720,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(piece.scale, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: false,
            }),
            Animated.timing(piece.scale, {
              toValue: 0.8,
              duration: 2500,
              useNativeDriver: false,
            }),
          ]),
        ]);
      });

      Animated.parallel(animations).start(() => {
        onComplete();
      });
    } else {
      // Reset all pieces
      confettiPieces.forEach((piece) => {
        piece.x.setValue(Math.random() * screenWidth);
        piece.y.setValue(-50);
        piece.rotation.setValue(0);
        piece.scale.setValue(1);
      });
    }
  }, [isVisible, onComplete, confettiPieces]);

  if (!isVisible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: piece.color,
              left: piece.x,
              top: piece.y,
              transform: [
                { rotate: piece.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })},
                { scale: piece.scale },
              ],
            },
          ]}
        />
      ))}
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
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
