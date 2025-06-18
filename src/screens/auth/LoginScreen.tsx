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
import LinearGradient from 'react-native-linear-gradient';
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
          <View style={styles.blurContainer}>
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
              <Text style={[styles.label, { color: theme.colors.textLight }]}>Email</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border }]}
                placeholder="Masukkan email Anda"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <Text style={[styles.label, { color: theme.colors.textLight }]}>Password</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border }]}
                placeholder="Masukkan password Anda"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordContainer}
              >
                <Text style={[styles.forgotPassword, { color: theme.colors.accent2 }]}>
                  Lupa Password?
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.accent1 }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.colors.textLight} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme.colors.textLight }]}>
                    Masuk
                  </Text>
                )}
              </TouchableOpacity>
              
              <View style={styles.registerContainer}>
                <Text style={[styles.registerText, { color: theme.colors.textLight }]}>
                  Belum punya akun?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={[styles.registerLink, { color: theme.colors.accent2 }]}>
                    Daftar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  blurContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: 'white',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    marginRight: 5,
  },
  registerLink: {
    fontWeight: 'bold',
  },
});

export default LoginScreen; 