import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';

import { MateriType, MATERI_AKSARA, MATERI_SANDHANGAN } from '@/components/material/dataMateri';
import { Colors } from '@/config/colors';
import CardGenerator from '@/components/material/cardGenerator';
import ModalMateri from '@/components/material/modalMateri';

export default function MateriScreen() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedMateri, setSelectedMateri] = useState<MateriType | null>(null);

  const handleOpenDetail = (materi: MateriType) => {
    setSelectedMateri(materi);
    setModalVisible(true);
  };

  const handleCloseDetail = () => {
    setModalVisible(false);
    setSelectedMateri(null);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Sinau Aksara Jawa</Text>
        <Text style={styles.subtitle}>Pilih salah satu aksara untuk mempelajari detailnya</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.partTitle}>Aksara Jawa</Text>
        <FlatList
          data={MATERI_AKSARA}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <CardGenerator item={item} onPress={() => handleOpenDetail(item)} />
          )}
          columnWrapperStyle={styles.listColumnWrapper}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}           
          nestedScrollEnabled={true}
        />

        <Text style={styles.partTitle}>Sandhangan</Text>
        <FlatList
          data={MATERI_SANDHANGAN}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <CardGenerator item={item} onPress={() => handleOpenDetail(item)} />
          )}
          columnWrapperStyle={styles.listColumnWrapper}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}          
          nestedScrollEnabled={true}
        />
      </ScrollView>

      <ModalMateri
        visible={modalVisible}
        item={selectedMateri}
        onClose={handleCloseDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  partTitle: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    textAlign: 'center',
    color: Colors.orange,
    marginBottom: 20
  },
  scrollContainer: {
    paddingBottom: 40, 
  },
  listColumnWrapper: {
    gap:10,
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1
  },
  listContentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 10
  },
});