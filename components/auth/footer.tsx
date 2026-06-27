import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface FooterProps {
  isLoginMode: boolean;
  onToggleMode: () => void;
}

export default function Footer({ isLoginMode, onToggleMode }: FooterProps) {
  return (
    <View style={styles.footerSection}>
      <Text style={styles.footerText}>
        {isLoginMode ? 'Belum punya akun? ' : 'Sudah punya akun? '}
      </Text>
      <TouchableOpacity onPress={onToggleMode}>
        <Text style={styles.registerText}>
          {isLoginMode ? 'Daftar Sekarang' : 'Masuk di Sini'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 35,
  },
  footerText: {
    color: '#a18262',
    fontSize: 18,
    fontFamily: 'Balthazar-Regular',
  },
  registerText: {
    color: '#6f411d',
    fontFamily: 'Fraunces-Bold',
    fontSize: 14,
  },
});