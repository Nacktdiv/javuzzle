import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

import { MateriType } from './dataMateri';

type Props = {
  item: MateriType;
  onPress: () => void;
};

export default function CardGenerator({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={item.aksara}
        style={styles.image}
      />
      <View style={styles.badge}>
        <Text style={styles.latinText}>{item.latin}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex:1,
    maxHeight:100,
    maxWidth: 100,
    aspectRatio: '1/1',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#cb9163',
    justifyContent: 'center',
    alignItems: 'center',
    gap:4,
    padding:4,
    // // Effect Shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    flex: 1, 
    aspectRatio: '1/1',
    borderWidth: 4,
    borderColor: '#6E4720'
  },
  badge: {
    backgroundColor: '#cb9163',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 20,
  },
  latinText: {
    fontSize: 14,
    fontFamily: 'Fraunces-Bold',
    color: '#fff',
  },
});