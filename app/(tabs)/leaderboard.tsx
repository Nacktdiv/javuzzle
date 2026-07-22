import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '@/config/supabase'; 
import { Colors } from '@/config/colors';
import LeaderboardCard from '@/components/leaderboard/leaderboardCard';

export type UserType = {
  id: string;
  email: string;
  nama: string;
  level: number;
  poin: number;
  study_plan: number;
  created_at: string;
};

export default function LeaderboardScreen() {
  const [leaderboardData, setLeaderboardData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, email, nama, level, poin, study_plan, created_at')
        .order('poin', { ascending: false })
        .limit(50);

      if (error) throw error;
      if (data) setLeaderboardData(data);
    } catch (error) {
      console.error('Gagal mengambil data leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Statis */}
      <View style={styles.header}>
        <Text style={styles.title}>Papan Peringkat</Text>
        <Text style={styles.subtitle}>Ksatria Pemburu Aksara Terunggul</Text>
      </View>

      {/* Konten Utama */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderboardCard user={item} rank={index + 1} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchLeaderboard}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark, 
  },
  header: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomWidth: 4,
    borderBottomColor: Colors.borderDark,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontFamily: 'Playfair-Display-Bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Balthazar-Regular',
    textAlign: 'center',
    color: Colors.textDark,
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30, 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});