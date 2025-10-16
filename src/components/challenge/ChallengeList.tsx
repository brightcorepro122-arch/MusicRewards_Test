// ChallengeList component - List of music challenges
import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ChallengeCard } from './ChallengeCard';
import { GlassCard } from '../ui/GlassCard';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

interface ChallengeListProps {
  onPlayChallenge: (challenge: MusicChallenge) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  style?: any;
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  onPlayChallenge,
  onRefresh,
  refreshing = false,
  style,
}) => {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);

  const renderChallenge = ({ item }: { item: MusicChallenge }) => (
    <ChallengeCard
      challenge={item}
      onPlay={onPlayChallenge}
      isCurrentTrack={currentTrack?.id === item.id}
      isPlaying={isPlaying}
    />
  );

  const renderEmptyState = () => (
    <GlassCard style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Challenges Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new music challenges to complete!
      </Text>
    </GlassCard>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Music Challenges</Text>
      <Text style={styles.headerSubtitle}>
        Complete listening challenges to earn points and unlock achievements
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
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
  header: {
    marginBottom: THEME.spacing.lg,
  },
  headerTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  headerSubtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    lineHeight: 22,
  },
  emptyState: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
  },
  emptyTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

