import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../utils/ThemeContext';
import { useAuthStore } from '../../store/authStore';

const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Silakan isi email dan password');
      return;
    }
    
    await login(email, password);
    
    if (error) {
      Alert.alert('Error', error);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo-placeholder.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[styles.title, { color: theme.colors.textLight }]}>
                EcoTerra
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.accent1 }]}>
                Pembelajaran Ekosistem
              </Text>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={[styles.label, { color: theme.colors.textLight }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: theme.colors.textLight,
                    borderColor: theme.colors.accent1
                  }
                ]}
                placeholder="Masukkan email Anda"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              
              <Text style={[styles.label, { color: theme.colors.textLight }]}>
                Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: theme.colors.textLight,
                    borderColor: theme.colors.accent1
                  }
                ]}
                placeholder="Masukkan password Anda"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <TouchableOpacity 
                style={[
                  styles.loginButton,
                  { backgroundColor: theme.colors.accent3 }
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.colors.secondary} />
                ) : (
                  <Text style={[styles.loginButtonText, { color: theme.colors.secondary }]}>
                    Masuk
                  </Text>
                )}
              </TouchableOpacity>
              
              <View style={styles.registerContainer}>
                <Text style={[styles.registerText, { color: theme.colors.textLight }]}>
                  Belum punya akun?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={[styles.registerLink, { color: theme.colors.accent3 }]}>
                    Daftar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    marginRight: 5,
  },
  registerLink: {
    fontWeight: 'bold',
  },
});

export default LoginScreen; 