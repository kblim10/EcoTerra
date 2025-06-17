import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../utils/ThemeContext';
import { useClassStore } from '../../store/classStore';
import { MaterialData, QuizData } from '../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

const ClassDetailScreen = ({ route, navigation }: any) => {
  const { classId, className } = route.params;
  const theme = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Kelas */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.className, { color: theme.colors.textLight }]}>
            {currentClass?.name || className}
          </Text>
          <Text style={[styles.classCode, { color: theme.colors.accent3 }]}>
            Kode: {currentClass?.code}
          </Text>
          <Text style={[styles.classDescription, { color: theme.colors.accent1 }]}>
            {currentClass?.description || 'Tidak ada deskripsi'}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => navigation.navigate('ClassForum', { 
              classId: classId,
              className: currentClass?.name || className
            })}
          >
            <Ionicons name="chatbubbles-outline" size={20} color={theme.colors.textLight} />
            <Text style={[styles.actionButtonText, { color: theme.colors.textLight }]}>
              Forum
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => navigation.navigate('Leaderboard', { classId: classId })}
          >
            <Ionicons name="trophy-outline" size={20} color={theme.colors.textLight} />
            <Text style={[styles.actionButtonText, { color: theme.colors.textLight }]}>
              Peringkat
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'materials' && { 
              borderBottomWidth: 2, 
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('materials')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'materials' ? theme.colors.primary : theme.colors.secondary }
            ]}
          >
            Materi
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'quizzes' && { 
              borderBottomWidth: 2, 
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'quizzes' ? theme.colors.primary : theme.colors.secondary }
            ]}
          >
            Kuis
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'students' && { 
              borderBottomWidth: 2, 
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('students')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'students' ? theme.colors.primary : theme.colors.secondary }
            ]}
          >
            Peserta
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content berdasarkan tab aktif */}
      <ScrollView style={styles.contentContainer}>
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
      </ScrollView>
    </View>
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginBottom: 15,
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classCode: {
    fontSize: 14,
    marginBottom: 10,
  },
  classDescription: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  actionButtonText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
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