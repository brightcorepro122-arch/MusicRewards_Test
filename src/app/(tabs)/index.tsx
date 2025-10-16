// Ultra-minimal home screen to test casting error
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  console.log('Ultra-minimal HomeScreen rendering...');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎵 MusicRewards App</Text>
      <Text style={styles.subtext}>Ultra-minimal test version</Text>
      <Text style={styles.status}>✅ No complex components</Text>
      <Text style={styles.status}>✅ No navigation</Text>
      <Text style={styles.status}>✅ No stores or hooks</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: '#34CB76',
    marginBottom: 5,
    textAlign: 'center',
  },
});