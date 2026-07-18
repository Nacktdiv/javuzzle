import React, { useState, createContext, useContext, ReactNode } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
interface AlertOptions {
  title?: string;
  message: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancelPressed?: () => void;
  onConfirmPressed?: () => void;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const CustomAlertProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({ message: '' });

  const showAlert = (newOptions: AlertOptions) => {
    setOptions(newOptions);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideAlert} 
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            {options.title && (
              <Text style={styles.title}>{options.title}</Text>
            )}

            <Text style={styles.message}>{options.message}</Text>

            <View style={styles.buttonContainer}>
              {(options.showCancelButton ?? false) && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    if (options.onCancelPressed) options.onCancelPressed();
                    hideAlert();
                  }}
                >
                  <Text style={styles.buttonText}>{options.cancelText ?? "Batal"}</Text>
                </TouchableOpacity>
              )}

              {(options.showConfirmButton ?? true) && (
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => {
                    if (options.onConfirmPressed) options.onConfirmPressed();
                    hideAlert();
                  }}
                >
                  <Text style={styles.buttonText}>{options.confirmText ?? "Oke"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

export const useCustomAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useCustomAlert harus digunakan di dalam CustomAlertProvider');
  }
  return context;
};

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
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Playfair-Display-Bold',
    color: '#6f411d',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Balthazar-Regular',
    color: '#4a2306',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
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
});