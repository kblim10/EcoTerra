import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/ThemeContext';

// Dummy data untuk kelas
const dummyClasses = [
  {
    id: '1',
    title: 'Pengenalan Lingkungan Hidup',
    instructor: 'Dr. Budi Santoso',
    duration: '8 minggu',
    progress: 60,
    image: require('../../assets/logo-placeholder.png'),
  },
  {
    id: '2',
    title: 'Pengelolaan Sampah',
    instructor: 'Ir. Siti Rahayu',
    duration: '6 minggu',
    progress: 30,
    image: require('../../assets/logo-placeholder.png'),
  },
  {
    id: '3',
    title: 'Energi Terbarukan',
    instructor: 'Prof. Ahmad Hidayat',
    duration: '10 minggu',
    progress: 10,
    image: require('../../assets/logo-placeholder.png'),
  },
];

const ClassScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const renderClassItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.classCard, { backgroundColor: theme.colors.card }]}
        onPress={() => 
          navigation.navigate('ClassDetail', { 
            classId: item.id, 
            className: item.title 
          })
        }
      >
        <Image source={item.image} style={styles.classImage} />
        <View style={styles.classInfo}>
          <Text style={[styles.classTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.classInstructor, { color: theme.colors.secondary }]}>
            {item.instructor}
          </Text>
          <Text style={[styles.classDuration, { color: theme.colors.secondary }]}>
            Durasi: {item.duration}
          </Text>
          
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { backgroundColor: theme.colors.border }
              ]}
            >
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.colors.primary,
                    width: `${item.progress}%` 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.secondary }]}>
              {item.progress}% selesai
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={dummyClasses}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  classCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  classImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  classInfo: {
    padding: 16,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  classInstructor: {
    fontSize: 14,
    marginBottom: 4,
  },
  classDuration: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
});

export default ClassScreen; 