// Glass design system components - Belong's signature UI
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly string[];
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = THEME.glass.blurIntensity,
  borderRadius = THEME.borderRadius.md,
  gradientColors = THEME.glass.gradientColors.card,
  style,
}) => {
  return (
    <View style={StyleSheet.flatten([{ borderRadius, overflow: 'hidden' }, style])}>
      <BlurView
        intensity={blurIntensity}
        style={StyleSheet.absoluteFillObject}
      />
      
      <LinearGradient
        colors={gradientColors as [string, string]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius,
          borderWidth: 1,
          borderColor: THEME.colors.border,
        }}
      />
      
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

// Glass Button Component
interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
  size = 'md',
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return THEME.glass.gradientColors.card;
      case 'success':
        return THEME.glass.gradientColors.success;
      case 'danger':
        return ['rgba(255, 107, 107, 0.8)', 'rgba(255, 107, 107, 0.6)'];
      default:
        return THEME.glass.gradientColors.button;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: THEME.spacing.md,
          paddingVertical: THEME.spacing.sm,
          fontSize: THEME.fonts.sizes.sm,
        };
      case 'lg':
        return {
          paddingHorizontal: THEME.spacing.xl,
          paddingVertical: THEME.spacing.lg,
          fontSize: THEME.fonts.sizes.lg,
        };
      default:
        return {
          paddingHorizontal: THEME.spacing.lg,
          paddingVertical: THEME.spacing.md,
          fontSize: THEME.fonts.sizes.md,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.buttonContainer,
        { opacity: isDisabled ? 0.6 : 1 },
        style,
      ]}
      activeOpacity={0.8}
    >
      <GlassCard
        borderRadius={THEME.borderRadius.lg}
        gradientColors={getVariantColors()}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={[styles.buttonContent, { paddingHorizontal: sizeStyles.paddingHorizontal, paddingVertical: sizeStyles.paddingVertical }]}>
        {loading ? (
          <ActivityIndicator color={THEME.colors.text.primary} size="small" />
        ) : (
          <Text
            style={[
              styles.buttonText,
              { fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  buttonContainer: {
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: THEME.colors.text.primary,
    fontWeight: THEME.fonts.weights.semibold,
    textAlign: 'center',
  },
});