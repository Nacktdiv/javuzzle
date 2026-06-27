import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '@/config/supabase.web'
import { useCustomAlert } from '@/components/main/customAlert';
import Header from '@/components/auth/header';
import Form from '@/components/auth/form';
import Footer from '@/components/auth/footer';

export default function AuthScreen() {
    const router = useRouter()   
    const { showAlert } = useCustomAlert()
    const [isLoginMode, setIsLoginMode] = useState(true);

    const handleAuthSubmit = async (formData: { fullName?: string; email: string; password: string }) => {
        const { fullName, email, password } = formData;

        if (isLoginMode) {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                showAlert({
                    title : "ErrorSignIn",
                    message : error.message,
                    confirmText : "OK",
                })
                return
            } else {
                router.replace('/(tabs)'); 
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { full_name: fullName } 
                }
            });

            if (error) {
                showAlert({
                    title : "ErrorSignUp",
                    message : error.message,
                    confirmText : "OK",
                })
            } else {
                showAlert({
                    title : "SuccessSignUp",
                    message : "Berhasil melakukan registrasi, silahkan buka email anda untuk konfirmasi",
                    confirmText : "OK",
                })
            }
        }
    }
    
    return (
        <KeyboardAvoidingView 
        //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Header isLoginMode={isLoginMode} />
            <Form isLoginMode={isLoginMode} onSubmit={handleAuthSubmit} />
            <Footer isLoginMode={isLoginMode} onToggleMode={() => setIsLoginMode(!isLoginMode)} />
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFECC8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
});