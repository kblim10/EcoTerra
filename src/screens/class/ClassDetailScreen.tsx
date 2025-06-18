import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Image,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../utils/ThemeContext';
import { useClassStore } from '../../store/classStore';
import { MaterialData, QuizData } from '../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const ClassDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const theme = useTheme();
  const { classId, className } = route.params;
  const { currentClass, fetchClassById, fetchMaterials, fetchQuizzes, materials, quizzes } = useClassStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials'); // 'materials', 'quizzes', 'students'
  
  useEffect(() => {
    // Set judul halaman
    navigation.setOptions({
      title: className || 'Detail Kelas',
    });
    
    // Muat data kelas
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchClassById(classId);
        await fetchMaterials(classId);
        await fetchQuizzes(classId);
      } catch (error) {
        Alert.alert('Error', 'Gagal memuat data kelas');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [classId, navigation]);
  
  // Dummy data untuk materi
  const dummyMaterials = [
    {
      id: '1',
      title: 'Pengenalan Konsep Lingkungan Hidup',
      type: 'pdf',
      description: 'Dokumen pengenalan dasar tentang lingkungan hidup dan ekosistem.',
      duration: '15 menit',
      isCompleted: true,
    },
    {
      id: '2',
      title: 'Video: Dampak Perubahan Iklim',
      type: 'video',
      description: 'Video mengenai dampak perubahan iklim terhadap ekosistem bumi.',
      duration: '20 menit',
      isCompleted: true,
    },
    {
      id: '3',
      title: 'Praktik Pengelolaan Sampah',
      type: 'pdf',
      description: 'Panduan praktis untuk pengelolaan sampah rumah tangga.',
      duration: '10 menit',
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Quiz: Pengetahuan Dasar Lingkungan',
      type: 'quiz',
      description: 'Uji pengetahuan Anda tentang dasar-dasar lingkungan hidup.',
      duration: '30 menit',
      isCompleted: false,
    },
    {
      id: '5',
      title: 'Studi Kasus: Restorasi Hutan',
      type: 'pdf',
      description: 'Studi kasus tentang upaya restorasi hutan di Indonesia.',
      duration: '25 menit',
      isCompleted: false,
    },
  ];

  // Dummy data untuk info kelas
  const classInfo = {
    title: className || 'Pengenalan Lingkungan Hidup',
    instructor: 'Dr. Budi Santoso',
    description: 'Kelas ini membahas tentang konsep dasar lingkungan hidup, ekosistem, dan bagaimana manusia dapat berinteraksi dengan alam secara berkelanjutan. Anda akan mempelajari berbagai isu lingkungan dan solusi praktis yang dapat diterapkan dalam kehidupan sehari-hari.',
    totalStudents: 120,
    duration: '8 minggu',
    level: 'Pemula',
    progress: 40,
    image: require('../../assets/logo-placeholder.png'),
  };
  
  // Render item materi
  const renderMaterialItem = ({ item }: { item: MaterialData }) => (
    <TouchableOpacity
      style={[styles.itemCard, { backgroundColor: theme.colors.background }]}
      onPress={() => navigation.navigate('MaterialDetail', { 
        materialId: item.id,
        materialTitle: item.title
      })}
    >
      <View style={styles.itemIconContainer}>
        <Ionicons 
          name={
            item.type === 'pdf' ? 'document-text' : 
            item.type === 'image' ? 'image' : 
            item.type === 'video' ? 'videocam' : 'link'
          } 
          size={24} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.itemDescription, { color: theme.colors.secondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );
  
  // Render item kuis
  const renderQuizItem = ({ item }: { item: QuizData }) => (
    <TouchableOpacity
      style={[styles.itemCard, { backgroundColor: theme.colors.background }]}
      onPress={() => navigation.navigate('Quiz', { 
        quizId: item.id,
        quizTitle: item.title,
        duration: item.duration
      })}
    >
      <View style={styles.itemIconContainer}>
        <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.itemDescription, { color: theme.colors.secondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.quizMeta}>
          <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.quizDuration, { color: theme.colors.primary }]}>
            {item.duration} menit
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
          Memuat data kelas...
        </Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* Header Image & Info */}
        <View style={styles.header}>
          <Image
            source={classInfo.image}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={[styles.infoContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.classTitle, { color: theme.colors.text }]}>
              {classInfo.title}
            </Text>
            <Text style={[styles.instructorName, { color: theme.colors.secondary }]}>
              Instruktur: {classInfo.instructor}
            </Text>
            <Text style={[styles.classDescription, { color: theme.colors.text }]}>
              {classInfo.description}
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {classInfo.totalStudents}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
                  Peserta
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {classInfo.duration}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
                  Durasi
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {classInfo.level}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
                  Level
                </Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
                  Progress Kelas
                </Text>
                <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
                  {classInfo.progress}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.colors.primary,
                      width: `${classInfo.progress}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
        
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'materials' && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('materials')}
          >
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    activeTab === 'materials'
                      ? theme.colors.primary
                      : theme.colors.secondary,
                },
              ]}
            >
              Materi
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'forum' && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => {
              setActiveTab('forum');
              navigation.navigate('ClassForum' as never, {
                classId,
                className,
              } as never);
            }}
          >
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    activeTab === 'forum'
                      ? theme.colors.primary
                      : theme.colors.secondary,
                },
              ]}
            >
              Forum
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'leaderboard' && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => {
              setActiveTab('leaderboard');
              navigation.navigate('Leaderboard' as never, { classId } as never);
            }}
          >
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    activeTab === 'leaderboard'
                      ? theme.colors.primary
                      : theme.colors.secondary,
                },
              ]}
            >
              Peringkat
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Materials List */}
        <View style={styles.materialsContainer}>
          {activeTab === 'materials' && (
            <View>
              {materials.length > 0 ? (
                materials.map((material) => (
                  <View key={material.id}>
                    {renderMaterialItem({ item: material })}
                  </View>
                ))
              ) : (
                <View style={[styles.emptyState, { borderColor: theme.colors.accent2 }]}>
                  <Text style={[styles.emptyStateText, { color: theme.colors.secondary }]}>
                    Belum ada materi untuk kelas ini
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {activeTab === 'quizzes' && (
            <View>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <View key={quiz.id}>
                    {renderQuizItem({ item: quiz })}
                  </View>
                ))
              ) : (
                <View style={[styles.emptyState, { borderColor: theme.colors.accent2 }]}>
                  <Text style={[styles.emptyStateText, { color: theme.colors.secondary }]}>
                    Belum ada kuis untuk kelas ini
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {activeTab === 'students' && (
            <View style={[styles.emptyState, { borderColor: theme.colors.accent2 }]}>
              <Text style={[styles.emptyStateText, { color: theme.colors.secondary }]}>
                Fitur daftar peserta akan segera hadir
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  classTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructorName: {
    fontSize: 14,
    marginBottom: 15,
  },
  classDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  materialsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizDuration: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    padding: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ClassDetailScreen; 