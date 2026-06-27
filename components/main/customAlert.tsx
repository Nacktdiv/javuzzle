import React, { useState, createContext, useContext, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

// 1. Tipe Data untuk Parameter Alert
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

// 2. Provider Global yang membungkus Root App
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
      <AwesomeAlert
        show={visible}
        showProgress={false}
        title={options.title}
        message={options.message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        
        // Pengaturan Tombol
        showCancelButton={options.showCancelButton ?? false}
        showConfirmButton={options.showConfirmButton ?? true}
        cancelText={options.cancelText ?? "Batal"}
        confirmText={options.confirmText ?? "Oke"}
        
        // Aksi Tombol
        onCancelPressed={() => {
          if (options.onCancelPressed) options.onCancelPressed();
          hideAlert();
        }}
        onConfirmPressed={() => {
          if (options.onConfirmPressed) options.onConfirmPressed();
          hideAlert();
        }}

        // STYLING MENYESUAIKAN TEMA JAVUZZLE (KAYU / KARAMEL)
        alertContainerStyle={styles.alertContainer}
        overlayStyle={styles.overlay}
        contentContainerStyle={styles.contentContainer}
        titleStyle={styles.title}
        messageStyle={styles.message}
        cancelButtonStyle={[styles.button, styles.cancelButton]}
        confirmButtonStyle={[styles.button, styles.confirmButton]}
        cancelButtonTextStyle={styles.buttonText}
        confirmButtonTextStyle={styles.buttonText}
      />
    </AlertContext.Provider>
  );
};

// 3. Custom Hook untuk dipanggil di Screen/Komponen manapun
export const useCustomAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useJavuzzleAlert harus digunakan di dalam JavuzzleAlertProvider');
  }
  return context;
};

// Style bertema Cokelat & Krem khas App-mu
const styles = StyleSheet.create({
  alertContainer: {
    zIndex: 9999,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: '#fff4eb', // Background krem terang agar kontras
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#6f411d', // Border kayu gelap
    padding: 20,
    width: '85%',
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
    marginBottom: 15,
    lineHeight: 22,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#cb9163', // Cokelat karamel khas tombol utama
    borderWidth: 2,
    borderColor: '#6f411d',
  },
  cancelButton: {
    backgroundColor: '#d97d7d', // Warna soft red untuk batal
    borderWidth: 2,
    borderColor: '#7a2b2b',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
  },
});