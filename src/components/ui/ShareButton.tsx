// ShareButton - Share achievements and progress component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { THEME } from '../../constants/theme';

interface ShareButtonProps {
  title?: string;
  message: string;
  onShare?: () => void;
  style?: any;
  textStyle?: any;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title = 'Share Achievement',
  message,
  onShare,
  style,
  textStyle,
}) => {
  const handleShare = () => {
    // In a real app, you would use the Share API
    // For now, we'll show an alert with the share content
    Alert.alert(
      title,
      `Share this achievement:\n\n${message}\n\n🎵 MusicRewards - Earn points by listening to music!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => {
            // Here you would implement actual sharing logic
            // using React Native's Share API or a third-party library
            console.log('Sharing:', message);
            onShare?.();
          }
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handleShare}>
      <Text style={[styles.buttonText, textStyle]}>📤 Share</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: '600',
  },
});
