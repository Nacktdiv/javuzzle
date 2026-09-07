import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/config/colors';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  type: 'nama' | 'study_plan' | 'password';
  currentValue?: string | number;
  onSave: (value1: string, value2?: string) => void;
}

const { width } = Dimensions.get('window');
const STUDY_PLAN_OPTIONS = [15, 30, 45, 60];

export default function ProfileEditModal({ visible, onClose, title, type, currentValue, onSave }: ProfileEditModalProps) {
  const [value, setValue] = useState<string>('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>(''); 

  useEffect(() => {
    if (visible) {
      setValue(type === 'password' ? '' : String(currentValue ?? ''));
      setNewPasswordConfirm('');
    }
  }, [visible, type, currentValue]);

  const handleSave = () => {
    if (!value.trim()) return;
    
    if (type === 'password') {
      onSave(value, newPasswordConfirm);
    } else {
      onSave(value);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>

          {type === 'nama' && (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              placeholder="Masukkan nama baru..."
              placeholderTextColor={Colors.secondary}
            />
          )}

          {type === 'study_plan' && (
            <View style={styles.optionsContainer}>
              {STUDY_PLAN_OPTIONS.map((menit) => {
                const isSelected = String(menit) === value;
                return (
                  <TouchableOpacity
                    key={menit}
                    style={[
                      styles.optionButton,
                      isSelected ? styles.optionButtonSelected : styles.optionButtonUnselected,
                    ]}
                    onPress={() => setValue(String(menit))}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected ? styles.optionTextSelected : styles.optionTextUnselected,
                      ]}
                    >
                      {menit} Menit
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {type === 'password' && (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                secureTextEntry
                placeholder="Kata sandi baru..."
                placeholderTextColor={Colors.secondary}
              />
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                value={newPasswordConfirm}
                onChangeText={setNewPasswordConfirm}
                secureTextEntry
                placeholder="Konfirmasi kata sandi baru..."
                placeholderTextColor={Colors.secondary}
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: Colors.text,
    borderRadius: 20,
    padding: 24,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Fraunces-Bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  passwordContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Balthazar-Regular',
    color: Colors.textDark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    marginTop: 24,
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.secondary,
  },
  cancelButton: {
    backgroundColor: Colors.danger,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionButton: {
    width: '47%', 
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionButtonSelected: {
    backgroundColor: Colors.secondary,
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Fraunces-Bold',
  },
  optionTextUnselected: {
    color: Colors.textDark,
  },
  optionTextSelected: {
    color: '#fff',
  },
});