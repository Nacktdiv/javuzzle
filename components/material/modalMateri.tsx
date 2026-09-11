import React, { useEffect, useState, useRef } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import { Colors } from '@/config/colors';
import { MateriType } from './dataMateri';

type Props = {
  visible: boolean;
  item: MateriType | null;
  onClose: () => void;
};

export default function ModalMateri({ visible, item, onClose }: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  
  // Menggunakan ref untuk menyimpan referensi instance sound terbaru secara sinkron
  const soundRef = useRef<Audio.Sound | null>(null);

  // Helper untuk menghentikan dan menghapus sound secara aman
  const stopAndUnloadSound = async () => {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
      } catch (err) {
        // Mengabaikan error jika sound sudah keburu ter-unload
      } finally {
        soundRef.current = null;
        setSound(null);
      }
    }
  };

  // Bersihkan audio dari memori saat komponen unmount atau modal ditutup
  useEffect(() => {
    return () => {
      stopAndUnloadSound();
    };
  }, []);

  if (!item) return null;

  const playAudio = async (audioSource: any, audioId: string) => {
    try {
      // Hentikan suara yang sedang berjalan jika ada
      await stopAndUnloadSound();

      if (!audioSource) return;

      setPlayingAudioId(audioId);

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true }
      );

      soundRef.current = newSound;
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate(async (status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAudioId(null);
          try {
            await newSound.unloadAsync();
          } catch (err) {
            // Safe ignore
          }
          if (soundRef.current === newSound) {
            soundRef.current = null;
            setSound(null);
          }
        }
      });
    } catch (error) {
      console.error('Gagal memutar audio:', error);
      setPlayingAudioId(null);
    }
  };

  const handleClose = async () => {
    await stopAndUnloadSound();
    setPlayingAudioId(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={30} color={Colors.text} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Header dengan Tombol Audio Utama */}
            <View style={styles.headerContainer}>
              <Image style={styles.detailAksara} source={item.aksara} resizeMode="contain" />
              <View style={styles.titleAudioRow}>
                <Text style={styles.detailLatin}>Aksara "{item.latin}"</Text>
                {item.audioAksara && (
                  <TouchableOpacity
                    style={styles.audioButtonHeader}
                    onPress={() => playAudio(item.audioAksara, 'main')}
                  >
                    <Ionicons
                      name={playingAudioId === 'main' ? 'volume-high' : 'volume-medium-outline'}
                      size={24}
                      color={Colors.text}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Section Penjelasan */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Penjelasan</Text>
              <Text style={styles.bodyText}>{item.deskripsi}</Text>
            </View>

            {/* Section Komponen */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Komponen</Text>
              {item.komponen.map((ex, index) => (
                <View key={index} style={[styles.universalRow, { flexDirection: 'row', height: 60 }]}>
                  <View style={styles.komponenContainerHeader}>
                    <Text style={styles.komponenKata}>{ex.nama}</Text>
                    <Text style={styles.komponenKata}>Urutan {ex.urutan}</Text>
                  </View>
                  <View style={styles.komponenContainerImage}>
                    <Image style={styles.komponenImage} source={ex.image} resizeMode="contain" />
                  </View>
                </View>
              ))}
            </View>

            {/* Section Contoh Kata dengan Tombol Audio Per-Baris */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contoh Kata</Text>
              {item.contoh.map((ex, index) => {
                const audioId = `contoh-${index}`;
                return (
                  <View
                    key={index}
                    style={[
                      styles.universalRow,
                      styles.contohRow,
                      index === item.contoh.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contohKata}>{ex.kata}</Text>
                      <Text style={styles.contohArti}>Artinya: {ex.arti}</Text>
                    </View>

                    {ex.audio && (
                      <TouchableOpacity
                        style={styles.audioButtonRow}
                        onPress={() => playAudio(ex.audio, audioId)}
                      >
                        <Ionicons
                          name={playingAudioId === audioId ? 'volume-high' : 'volume-medium-outline'}
                          size={22}
                          color={Colors.text}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 30,
    maxHeight: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    backgroundColor: Colors.orange,
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailAksara: {
    height: 100,
    aspectRatio: 1,
  },
  titleAudioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  detailLatin: {
    fontSize: 22,
    fontFamily: 'Fraunces-Bold',
    color: Colors.orange,
  },
  audioButtonHeader: {
    backgroundColor: Colors.orange,
    padding: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: Colors.orange,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: 'Balthazar-Regular',
    color: Colors.textDark,
    lineHeight: 20,
  },
  universalRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contohRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  komponenContainerHeader: {
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  komponenKata: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: 'Fraunces-Bold',
  },
  komponenContainerImage: {
    aspectRatio: 1,
    height: '100%',
    backgroundColor: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    padding: 4,
  },
  komponenImage: {
    width: '100%',
    height: '100%',
  },
  contohKata: {
    fontSize: 20,
    color: Colors.textDark,
    fontFamily: 'Fraunces-Bold',
    marginBottom: 2,
  },
  contohArti: {
    fontSize: 14,
    color: Colors.orange,
    fontFamily: 'Balthazar-Regular',
  },
  audioButtonRow: {
    backgroundColor: Colors.orange,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});