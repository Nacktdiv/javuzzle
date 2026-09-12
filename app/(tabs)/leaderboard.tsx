import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '@/config/supabase'; 
import { Colors } from '@/config/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CopilotStep, walkthroughable, useCopilot, CopilotProvider } from 'react-native-copilot';
import { userType } from '@/app/_layout';
import LeaderboardCard from '@/components/leaderboard/leaderboardCard';

const CopilotView = walkthroughable(View);

// 1. Sub-komponen Podium Statis
const PodiumItem = ({ user, rank }: { user?: userType; rank: number }) => {
  if (!user) return <View style={styles.podiumPlaceholder} />;

  const isFirst = rank === 1;
  const height = isFirst ? 175 : rank === 2 ? 150 : 125;
  const bgColor = isFirst ? Colors.success : rank === 2 ? '#EF4444' : Colors.warning;

  return (
    <View style={styles.podiumItemContainer}>
      <View style={[styles.podiumAvatar, isFirst && styles.podiumAvatarFirst]}>
        <Ionicons name="person" size={isFirst ? 36 : 24} color={Colors.secondary} />
      </View>

      <View style={[styles.podiumPillar, { height, backgroundColor: bgColor }]}>
        <Text style={styles.podiumRank}>{rank}</Text>
        <Text style={styles.podiumName} numberOfLines={1}>{user.nama || 'Ksatria'}</Text>
        <View style={styles.podiumScore}>
          <Image
            source={require('../../assets/images/coin.png')}
            style={styles.podiumScoreIcon}
          />
          <Text style={styles.podiumScoreText}>{user.poin}</Text>
        </View>
      </View>
    </View>
  );
};

// 2. Component Header Terpisah (Di luar FlatList)
interface LeaderboardHeaderProps {
  top3: userType[];
  onBack: () => void;
  onStartWalkthrough: () => void;
}

const LeaderboardHeader = React.memo(({ top3, onBack, onStartWalkthrough }: LeaderboardHeaderProps) => {
  return (
    <View style={styles.headerWrapper} collapsable={false}>
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color={Colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Peringkat</Text>
        <TouchableOpacity 
          style={styles.helpBtn} 
          onPress={onStartWalkthrough}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={24} color={Colors.primaryDark} />
        </TouchableOpacity>
      </View>

      {/* STEP 1 Copilot: Podium Top 3 */}
      <CopilotStep
        text="Area podium ini menampilkan 3 ksatria terbaik dengan perolehan poin tertinggi saat ini."
        order={1}
        name="podiumStep"
      >
        <CopilotView style={styles.podiumContainer} collapsable={false}>
          <PodiumItem rank={2} user={top3[1]} />
          <PodiumItem rank={1} user={top3[0]} />
          <PodiumItem rank={3} user={top3[2]} />
        </CopilotView>
      </CopilotStep>

      <View style={styles.listCurveTop} />
    </View>
  );
});

// 3. Konten Utama Leaderboard
function LeaderboardContent() {
  const router = useRouter();
  const { start } = useCopilot();

  const [leaderboardData, setLeaderboardData] = useState<userType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      // Cek koneksi internet terlebih dahulu
      const netState = await NetInfo.fetch();
      const online = Boolean(netState.isConnected && netState.isInternetReachable);
      setIsConnected(online);

      if (!online) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, email, nama, level, poin, study_plan, created_at, today_minutes, streak')
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

    // Listen perubahan koneksi internet secara otomatis
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable);
      setIsConnected(online);
      if (online) {
        fetchLeaderboard();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleStartWalkthrough = useCallback(() => {
    setTimeout(() => {
      start().catch((err) => console.log('Error starting walkthrough:', err));
    }, 100);
  }, [start]);

  const top3 = useMemo(() => leaderboardData.slice(0, 3), [leaderboardData]);
  const restList = useMemo(() => leaderboardData.slice(3), [leaderboardData]);

  const renderItem = useCallback(({ item, index }: { item: userType; index: number }) => (
    <LeaderboardCard user={item} rank={index + 4} />
  ), []);

  return (
    <View style={styles.container}>
      {/* Dynamic Navigation Bar untuk Kondisi Loading / Offline */}
      {(!isConnected || loading) && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color={Colors.primaryDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Peringkat</Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : !isConnected ? (
        /* TAMPILAN KETIKA OFFLINE */
        <View style={styles.offlineContainer}>
          <View style={styles.offlineIconWrapper}>
            <Ionicons name="wifi-outline" size={64} color={Colors.primaryDark} />
          </View>
          <Text style={styles.offlineTitle}>Koneksi Terputus</Text>
          <Text style={styles.offlineSubTitle}>
            Aktifkan koneksi internet Anda untuk melihat daftar peringkat ksatria terbaru.
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={fetchLeaderboard}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={20} color={Colors.text} />
            <Text style={styles.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* TAMPILAN KETIKA ONLINE (NORMAL) */
        <View style={{ flex: 1 }}>
          <LeaderboardHeader
            top3={top3}
            onBack={handleBack}
            onStartWalkthrough={handleStartWalkthrough}
          />

          <CopilotStep
            text="Bagian daftar ini menampilkan urutan peringkat selanjutnya (posisi 4 ke bawah). Kumpulkan lebih banyak poin untuk merebut posisi teratas!"
            order={2}
            name="restListStep"
          >
            <CopilotView style={styles.listWrapper} collapsable={false}>
              <FlatList
                data={restList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.flatList}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
                onRefresh={fetchLeaderboard}
                refreshing={loading}
              />
            </CopilotView>
          </CopilotStep>
        </View>
      )}
    </View>
  );
}

// 4. Component Wrapper Utama
export default function LeaderboardScreen() {
  return (
    <CopilotProvider
      stopOnOutsideClick
      androidStatusBarVisible
      verticalOffset={24}
      backdropColor="rgba(0, 0, 0, 0.6)"
      labels={{
        previous: 'Sebelumnya',
        next: 'Lanjut',
        skip: 'Lewati',
        finish: 'Selesai',
      }}
    >
      <LeaderboardContent />
    </CopilotProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark, 
  },
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.text,
  },
  flatList: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 100, 
  },
  headerWrapper: {
    backgroundColor: Colors.backgroundDark, 
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',   
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    zIndex: 10,
  },
  backBtn: {
    padding: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Fraunces-Bold',
    color: Colors.primaryDark,
  },
  helpBtn: {
    padding: 8,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 'auto',
    zIndex: 5,
  },
  podiumItemContainer: {
    alignItems: 'center',
    width: '28%',
    marginHorizontal: 4,
  },
  podiumPlaceholder: {
    width: '28%',
    marginHorizontal: 4,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.text,
    borderWidth: 3,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -15, 
    zIndex: 6,
  },
  podiumAvatarFirst: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: Colors.gold,
    borderWidth: 4,
    marginBottom: -20,
  },
  podiumPillar: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 4,
  },
  podiumRank: {
    fontSize: 22,
    fontFamily: 'Fraunces-Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: 13,
    fontFamily: 'Balthazar-Regular',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  podiumScoreText: {
    fontSize: 12,
    fontFamily: 'Fraunces-Bold',
    color: Colors.text,
  },
  listCurveTop: {
    backgroundColor: Colors.text, 
    height: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    zIndex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumScoreIcon: {
    width: 24,
    height: 24,
  },
  /* Offline State Styles */
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  offlineIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  offlineTitle: {
    fontSize: 22,
    fontFamily: 'Fraunces-Bold',
    color: Colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  offlineSubTitle: {
    fontSize: 14,
    fontFamily: 'Balthazar-Regular',
    color: Colors.primaryDark,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 24,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  retryBtnText: {
    fontSize: 14,
    fontFamily: 'Fraunces-Bold',
    color: Colors.text,
  },
});