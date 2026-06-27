import { StyleSheet, Text, View } from 'react-native';

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Halaman Profil Pengguna COOMING SOON!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFECC8' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#3E3224' },
});