import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
            <Ionicons name="person-outline" size={20} color="#6f411d" style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Masukkan nama lengkap kamu"
              placeholderTextColor="#a18262"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>
        </>
      )}

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#6f411d" style={styles.inputIcon} />
        <TextInput 
          style={styles.input}
          placeholder="Masukkan email kamu"
          placeholderTextColor="#a18262"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Kata Sandi</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#6f411d" style={styles.inputIcon} />
        <TextInput 
          style={styles.input}
          placeholder="Masukkan kata sandi"
          placeholderTextColor="#a18262"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="#6f411d" />
        </TouchableOpacity>
      </View>

      {isLoginMode && (
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handlePressSubmit}>
        <Text style={styles.loginButtonText}>
          {isLoginMode ? 'Masuk' : 'Daftar Akun Baru'}
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
    color: '#6f411d',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#cb9163',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#6f411d',
    fontSize: 18,
    fontFamily: 'Balthazar-Regular',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#6f411d',
    fontFamily: 'Fraunces-Bold',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#cb9163',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#6f411d', 
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Fraunces-Bold',
  },
});