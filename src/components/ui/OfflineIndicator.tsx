// OfflineIndicator - Network status indicator component
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../constants/theme';

interface OfflineIndicatorProps {
  showWhenOnline?: boolean;
  position?: 'top' | 'bottom';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showWhenOnline = false,
  position = 'top',
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate network status for demo purposes
    // In a real app, you would use NetInfo or similar
    const checkNetworkStatus = () => {
      // For demo, we'll assume online by default
      const connected = true; // This would come from NetInfo in real implementation
      setIsConnected(connected);
      
      // Show indicator when offline, or when online if showWhenOnline is true
      const shouldShow = !connected || (connected && showWhenOnline);
      setIsVisible(shouldShow);
      
      // Animate in/out
      Animated.timing(fadeAnim, {
        toValue: shouldShow ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    checkNetworkStatus();
  }, [showWhenOnline, fadeAnim]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          backgroundColor: isConnected ? THEME.colors.success : THEME.colors.error,
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.text}>
        {isConnected ? '🟢 Online' : '🔴 Offline - Limited functionality'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  topPosition: {
    top: 0,
  },
  bottomPosition: {
    bottom: 0,
  },
  text: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
});
