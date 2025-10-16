// ChallengeList component - List of music challenges
import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { ChallengeCard } from './ChallengeCard';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

interface ChallengeListProps {
  challenges: MusicChallenge[];
  onPlayChallenge: (challenge: MusicChallenge) => void;
  challengeProgress: Record<string, number>;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges,
  onPlayChallenge,
  challengeProgress,
  refreshing = false,
  onRefresh,
}) => {
  const renderChallenge = ({ item }: { item: MusicChallenge }) => (
    <ChallengeCard
      challenge={item}
      onPlay={onPlayChallenge}
      progress={challengeProgress[item.id] || 0}
    />
  );

  const renderEmptyState = () => (
    <GlassCard style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Challenges Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new music challenges!
      </Text>
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={THEME.colors.primary}
              colors={[THEME.colors.primary]}
            />
          ) : undefined
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  emptyState: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
  },
  emptyTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
