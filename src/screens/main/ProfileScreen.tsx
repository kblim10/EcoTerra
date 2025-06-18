import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/ThemeContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Dummy user data
  const user = {
    name: 'Pengguna EcoTerra',
    email: 'pengguna@ecoterra.id',
    joinDate: 'Januari 2023',
    points: 750,
    level: 'Pemula',
    completedCourses: 2,
    avatar: require('../../assets/default-avatar.png'),
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Dalam implementasi nyata, perubahan tema akan diterapkan di sini
  };

  // Toggle notifikasi
  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Dalam implementasi nyata, proses logout akan dilakukan di sini
            navigation.navigate('Login' as never);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.avatarContainer}>
          <Image source={user.avatar} style={styles.avatar} />
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.userName, { color: theme.colors.textLight }]}>
          {user.name}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.textLight }]}>
          {user.email}
        </Text>
        <Text style={[styles.joinDate, { color: theme.colors.textLight }]}>
          Bergabung sejak {user.joinDate}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.textLight }]}>
              {user.points}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>
              Poin
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.textLight }]}>
              {user.level}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>
              Level
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.textLight }]}>
              {user.completedCourses}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>
              Kelas Selesai
            </Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Pengaturan
        </Text>

        <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#d1d1d1', true: theme.colors.primary + '80' }}
            thumbColor={isDarkMode ? theme.colors.primary : '#f4f4f4'}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            Notifikasi
          </Text>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#d1d1d1', true: theme.colors.primary + '80' }}
            thumbColor={notifications ? theme.colors.primary : '#f4f4f4'}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Akun
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
            Edit Profil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
            Ubah Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
            Sertifikat Saya
          </Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Tentang
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
            Tentang EcoTerra
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
            Kebijakan Privasi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
            Syarat dan Ketentuan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  joinDate: {
    fontSize: 12,
    marginBottom: 16,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  menuItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 16,
  },
  logoutButton: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 