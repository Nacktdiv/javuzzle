import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { MateriType, MATERI_AKSARA } from '@/components/material/dataMateri';
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
      />

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
    backgroundColor: '#FFECC8',
  },
  header: {
    backgroundColor: '#cb9163',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#6f411d',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontFamily: 'Playfair-Display-Bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Balthazar-Regular',
    textAlign: 'center',
    color: '#3E3224',
    marginTop: 4,
  },
  listColumnWrapper: {
    gap:10,
    justifyContent: 'center',
    alignContent: 'center'
  },
  listContentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 10
  },
});