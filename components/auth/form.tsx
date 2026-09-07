import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/config/colors';

interface FormProps {
  isLoginMode: boolean;
  onSubmit: (data: { fullName?: string; email: string; password: string }) => void;
}

export default function Form({ isLoginMode, onSubmit }: FormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handlePressSubmit = () => {
    onSubmit({ fullName, email, password });
  };

  return (
    <View style={styles.formSection}>
      {!isLoginMode && (
        <>
          <Text style={styles.label}>Nama Lengkap</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color={Colors.primary} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Masukkan Nama Lengkap Kamu"
              placeholderTextColor={Colors.secondary}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>
        </>
      )}

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={22} color={Colors.primary} style={styles.inputIcon} />
        <TextInput 
          style={styles.input}
          placeholder="Masukkan Email Kamu"
          placeholderTextColor={Colors.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Kata Sandi</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color={Colors.primary} style={styles.inputIcon} />
        <TextInput 
          style={styles.input}
          placeholder="Masukkan Kata Sandi"
          placeholderTextColor={Colors.secondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {isLoginMode && (
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handlePressSubmit}>
        <Text style={styles.loginButtonText}>
          {isLoginMode ? 'Masuk' : 'Daftar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.textDark,
    fontSize: 15,
    fontFamily: 'Balthazar-Regular',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: Colors.gold,
    fontFamily: 'Fraunces-Regular',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.primary, 
    marginTop: 8,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  loginButtonText: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: 'Fraunces-Bold',
  },
});