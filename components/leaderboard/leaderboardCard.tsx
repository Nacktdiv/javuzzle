import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { Colors } from '@/config/colors';
import { Ionicons } from '@expo/vector-icons';
import { userType } from '@/app/_layout';

interface LeaderboardCardProps {
  user: userType;
  rank: number;
}

const { width } = Dimensions.get('window');

export default function LeaderboardCard({ user, rank }: LeaderboardCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.rankText}>{rank}</Text>

      <View style={styles.card}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color={Colors.secondary} />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.nameText} numberOfLines={1}>
            {user.nama || 'Ksatria Javuzzle'}
          </Text>
        </View>

        {/* Score & Trend */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{user.poin}</Text>
          <Image
            source={require('../../assets/images/coin.png')}
            style={styles.scoreIcon}
          />
          <Ionicons name="trending-up" size={18} color={Colors.success} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  rankText: {
    fontSize: 22,
    fontFamily: 'Fraunces-Bold',
    color: Colors.primaryDark,
    width: 35, // Lebar tetap agar sejajar vertikal
    textAlign: 'center',
    marginRight: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background, // Krem sedikit lebih gelap dari warna text
    borderRadius: 16,
    paddingVertical: 12, 
    paddingHorizontal: 16,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.text,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: Colors.primaryDark, 
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: Colors.primaryDark,
    marginRight: 4,
  },
  scoreIcon: {
    width: 32,
    height: 32,
  }
});