import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/config/supabase'; 
import { useCustomAlert } from '@/components/main/customAlert';

import { globalDataContext } from '@/app/_layout';
import { useContext } from 'react';

import ProfileStatItem from '@/components/profile/profileStatItem';
import ProfileActionItem from '@/components/profile/profileActionItem';
import ProfileEditModal from '@/components/profile/profileEditModal';

type ModalConfig = {
  visible: boolean;
  title: string;
  type: 'nama' | 'study_plan' | 'password';
  currentValue?: string | number;
}

const { width } = Dimensions.get('window');

export default function Profile() {
  const { user, setUser, checkUserProfile } = useContext(globalDataContext);
  const { showAlert } = useCustomAlert();

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    visible: false,
    title: '',
    type: 'nama',
  });

  const handleSaveProfileUpdate = async (value1: string) => {
    if (!user) return;
    const field = modalConfig.type;
    const formattedValue = field === 'study_plan' ? parseInt(value1, 10) : value1;

    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: formattedValue })
        .eq('id', user.id);

      if (error) throw error;
      
      showAlert({ message: 'Data berhasil diperbarui!', title: 'Sukses' });
      checkUserProfile(user?.id); 
    } catch (e: any) {
      showAlert({ message: e.message, title: 'Gagal' });
    }
  };

  const handleSavePasswordUpdate = async (pass: string, confirmPass?: string) => {
    if (pass !== confirmPass) {
      showAlert({ message: 'Konfirmasi kata sandi tidak cocok!', title: 'Gagal' });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: pass });
      if (error) throw error;
      showAlert({ message: 'Kata sandi berhasil diubah!', title: 'Sukses' });
    } catch (e: any) {
      showAlert({ message: e.message, title: 'Gagal' });
    }
  };

  const handleResetProgress = () => {
    if (!user) return;
    showAlert({
      title: 'Reset Progres?',
      message: 'Apakah kamu yakin ingin mengembalikan Level ke 1 dan Poin ke 0? Tindakan ini tidak bisa dibatalkan.',
      showCancelButton: true,
      confirmText: 'Reset',
      cancelText: 'Batal',
      onConfirmPressed: async () => {
        try {
          const { error } = await supabase
            .from('users')
            .update({ level: 1, poin: 0 })
            .eq('id', user.id);

          if (error) throw error;
          showAlert({ message: 'Progres permainan berhasil di-reset!', title: 'Sukses' });
          checkUserProfile(user?.id);
        } catch (e: any) {
          showAlert({ message: e.message, title: 'Gagal' });
        }
      }
    });
  };

  const handleLogout = () => {
    showAlert({
      title: 'Keluar Aplikasi',
      message: 'Apakah kamu yakin ingin meninggalkan Javuzzle?',
      showCancelButton: true,
      confirmText: 'Keluar',
      onConfirmPressed: async () => {
        await supabase.auth.signOut();
        setUser(null); 
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.nama ? user.nama.charAt(0).toUpperCase() : 'J'}
          </Text>
        </View>
        <Text style={styles.nameText}>{user?.nama || 'Ksatria Javuzzle'}</Text>
        <Text style={styles.emailText}>{user?.email || 'ksatria@javuzzle.com'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <ProfileStatItem label="Level Game" value={user?.level ?? 1} />
        <View style={styles.divider} />
        <ProfileStatItem label="Total Poin" value={user?.poin ?? 0} />
        <View style={styles.divider} />
        <ProfileStatItem label="Plan Belajar" value={`${user?.study_plan ?? 0} m`} />
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
        <ProfileActionItem 
          label="Edit Nama Pengguna" 
          onPress={() => setModalConfig({ visible: true, title: 'Ubah Nama Ksatria', type: 'nama', currentValue: user?.nama })} 
        />

        <ProfileActionItem 
          label="Ubah Plan Belajar" 
          onPress={() => setModalConfig({ visible: true, title: 'Atur Target Belajar', type: 'study_plan', currentValue: user?.study_plan })} 
        />

        <ProfileActionItem 
          label="Ganti Kata Sandi (Password)" 
          onPress={() => setModalConfig({ visible: true, title: 'Setel Ulang Password', type: 'password' })} 
        />

        <Text style={styles.sectionTitle}>Zona Berbahaya</Text>
        <ProfileActionItem label="Reset Level & Poin Game" onPress={handleResetProgress} isDanger={true} />
        <ProfileActionItem label="Keluar (Logout)" onPress={handleLogout} isDanger={true} />
      </ScrollView>

      <ProfileEditModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        type={modalConfig.type}
        currentValue={modalConfig.currentValue}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        onSave={modalConfig.type === 'password' ? handleSavePasswordUpdate : handleSaveProfileUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFECC8',
  },
  profileHeader: {
    backgroundColor: '#cb9163', 
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 4,
    borderBottomColor: '#6f411d', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  avatarCircle: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: (width * 0.22) / 2,
    backgroundColor: '#fff4eb',
    borderWidth: 3,
    borderColor: '#6f411d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: width * 0.09,
    fontFamily: 'Playfair-Display-Bold',
    color: '#6f411d',
  },
  nameText: {
    fontSize: 22,
    fontFamily: 'Playfair-Display-Bold',
    color: '#fff',
  },
  emailText: {
    fontSize: 14,
    fontFamily: 'Balthazar-Regular',
    color: '#3E3224',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6f411d',
    marginTop: -20,
    elevation: 3,
    shadowColor: '#6f411d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingVertical: 4,
  },
  divider: {
    width: 2,
    backgroundColor: '#FFECC8',
    marginVertical: 12,
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: '#cb9163',
    marginTop: 15,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});