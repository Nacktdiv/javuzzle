import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';

import { MateriType } from './dataMateri'

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
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              <Image style={styles.detailAksara} source={item.aksara}/>
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
                    <Image style={styles.komponenImage} source={ex.image}/>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contoh Kata</Text>
              {item.contoh.map((ex, index) => (
                <View key={index} style={styles.universalRow}>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFECC8',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    maxHeight: '80%',
    borderTopWidth: 5,
    borderColor: '#6f411d',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#cb9163',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailAksara: {
    height:150,
    aspectRatio: 1
  },
  detailLatin: {
    fontSize: 22,
    fontFamily: 'Fraunces-Bold',
    color: '#3E3224',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#cb9163',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: '#6f411d',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: 'Balthazar-Regular',
    color: '#3E3224',
    lineHeight: 22,
  },
  universalRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FFECC8',
  },
  komponenContainerHeader: {
    gap:5,
    flex: 1
  },
  komponenKata: {
    fontSize: 16,
    color: '#6f411d',
    fontFamily: 'Fraunces-Bold',
  },
  komponenContainerImage: {
    aspectRatio: 1,
    height: '100%',
    // flex:1,
    borderWidth: 2,
    borderColor: '#6f411d'
  }, 
  komponenImage: {
    width: '100%',
    height: '100%',
    objectFit: "cover"
  },
  contohKata: {
    fontSize: 20,
    color: '#6f411d',
    fontFamily: 'Fraunces-Bold',
  },
  contohArti: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Balthazar-Regular',
  },
});