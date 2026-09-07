import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/config/colors';
import { MateriType } from './dataMateri';

type Props = {
  visible: boolean;
  item: MateriType | null;
  onClose: () => void;
};

export default function ModalMateri({ visible, item, onClose }: Props) {
  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color={Colors.text} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
  
            <View style={styles.headerContainer}>
              <Image style={styles.detailAksara} source={item.aksara} resizeMode="contain" />
              <Text style={styles.detailLatin}>Aksara "{item.latin}"</Text>
            </View>


            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Penjelasan</Text>
              <Text style={styles.bodyText}>{item.deskripsi}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Komponen</Text>
              {item.komponen.map((ex, index) => (
                <View key={index} style={[styles.universalRow, {flexDirection: 'row', height: 60}]}>
                  <View style={styles.komponenContainerHeader}>
                    <Text style={styles.komponenKata}>{ex.nama}</Text>
                    <Text style={styles.komponenKata}>Urutan {ex.urutan}</Text>
                  </View>
                  <View style={styles.komponenContainerImage}>
                    <Image style={styles.komponenImage} source={ex.image} resizeMode="contain"/>
                  </View>
                </View>
              ))}
            </View>


            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contoh Kata</Text>
              {item.contoh.map((ex, index) => (
                <View key={index} style={[styles.universalRow, index === item.contoh.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.contohKata}>{ex.kata}</Text>
                  <Text style={styles.contohArti}>Artinya: {ex.arti}</Text>
                </View>
              ))}
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
    paddingTop: 30, // Jarak lebih atas untuk scroll
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
  detailLatin: {
    fontSize: 22,
    fontFamily: 'Fraunces-Bold',
    color: Colors.orange, // Mengubah warna judul menjadi oranye sesuai mockup
    marginTop: 10,
  },
  section: {
    backgroundColor: Colors.backgroundDark, // Background seksi tanpa border tebal
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
    color: Colors.orange, // Teks judul seksi berwarna oranye
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
    borderBottomColor: Colors.border, // Garis bawah lebih tipis
  },
  komponenContainerHeader: {
    gap: 4,
    flex: 1,
    justifyContent: 'center'
  },
  komponenKata: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: 'Fraunces-Bold',
  },
  komponenContainerImage: {
    aspectRatio: 1,
    height: '100%',
    backgroundColor: Colors.text, // Background putih untuk image box
    borderWidth: 1,
    borderColor: Colors.borderDark, // Border coklat tipis untuk komponen
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
});