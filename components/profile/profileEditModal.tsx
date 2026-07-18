import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';

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
              placeholderTextColor="#a68a70"
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
                placeholderTextColor="#a68a70"
              />
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                value={newPasswordConfirm}
                onChangeText={setNewPasswordConfirm}
                secureTextEntry
                placeholder="Konfirmasi kata sandi baru..."
                placeholderTextColor="#a68a70"
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
    backgroundColor: '#fff4eb',
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#6f411d',
    padding: 20,
    width: '85%',
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Playfair-Display-Bold',
    color: '#6f411d',
    textAlign: 'center',
    marginBottom: 15,
  },
  passwordContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#cb9163',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: width * 0.025,
    fontSize: 16,
    fontFamily: 'Balthazar-Regular',
    color: '#4a2306',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#cb9163',
    borderWidth: 2,
    borderColor: '#6f411d',
  },
  cancelButton: {
    backgroundColor: '#d97d7d',
    borderWidth: 2,
    borderColor: '#7a2b2b',
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
    paddingVertical: width * 0.03,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonUnselected: {
    backgroundColor: '#fff',
    borderColor: '#cb9163',
  },
  optionButtonSelected: {
    backgroundColor: '#cb9163',
    borderColor: '#6f411d',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
  },
  optionTextUnselected: {
    color: '#6f411d',
  },
  optionTextSelected: {
    color: '#fff',
  },
});