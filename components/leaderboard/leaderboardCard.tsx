import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import type { UserType } from '@/app/(tabs)/leaderboard';

interface LeaderboardCardProps {
  user: UserType;
  rank: number;
}

const { width } = Dimensions.get('window');

export default function LeaderboardCard({ user, rank }: LeaderboardCardProps) {
  const isTopRank = rank <= 3;
  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; 
  
  return (
    <View style={styles.card}>
      <View style={[
        styles.rankBadge, 
        isTopRank && { backgroundColor: rankColors[rank - 1], borderRadius: 20 }
      ]}>
        <Text style={[styles.rankText, isTopRank && styles.topRankText]}>
          {rank}
        </Text>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.nameText} numberOfLines={1}>
          {user.nama || 'Ksatria Javuzzle'}
        </Text>
        <Text style={styles.levelText}>Level {user.level}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{user.poin}</Text>
        <Text style={styles.ptsLabel}>Pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6f411d',
    borderRadius: 12,
    paddingVertical: width * 0.035, 
    paddingHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#6f411d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  rankBadge: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: '#6f411d',
  },
  topRankText: {
    color: '#fff',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Playfair-Display-Bold',
    color: '#3E3224', 
    marginBottom: 2,
  },
  levelText: {
    fontSize: 13,
    fontFamily: 'Balthazar-Regular',
    color: '#cb9163', 
  },
  scoreContainer: {
    // alignItems: 'trailing',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'Fraunces-Bold',
    color: '#6f411d',
    textAlign: 'right',
  },
  ptsLabel: {
    fontSize: 11,
    fontFamily: 'Balthazar-Regular',
    color: '#3E3224',
    textAlign: 'right',
  },
});