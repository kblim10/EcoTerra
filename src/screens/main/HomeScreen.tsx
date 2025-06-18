import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../utils/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { useClassStore } from '../../store/classStore';
import { supabase } from '../../services/supabaseClient';
import { MaterialData, ForumPostData } from '../../services/supabaseClient';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAuthStore();
  const { classes, fetchClasses } = useClassStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [latestMaterials, setLatestMaterials] = useState<MaterialData[]>([]);
  const [latestForumPosts, setLatestForumPosts] = useState<ForumPostData[]>([]);
  
  // Fungsi untuk memuat data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Muat kelas
      await fetchClasses();
      
      // Muat materi terbaru
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (materialsError) throw materialsError;
      setLatestMaterials(materialsData as MaterialData[]);
      
      // Muat posting forum terbaru
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (postsError) throw postsError;
      setLatestForumPosts(postsData as ForumPostData[]);
      
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  // Efek untuk memuat data saat komponen dimuat
  useEffect(() => {
    loadData();
  }, []);
  
  // Handler untuk refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  // Render item kelas
  const renderClassItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.classCard, { backgroundColor: theme.colors.accent1 }]}
      onPress={() => navigation.navigate('ClassDetail', { 
        classId: item.id,
        className: item.name
      })}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.classCardGradient}
      >
        <Text style={[styles.classCardTitle, { color: theme.colors.textLight }]}>
          {item.name}
        </Text>
        <Text style={[styles.classCardCode, { color: theme.colors.accent3 }]}>
          Kode: {item.code}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  
  // Render item materi
  const renderMaterialItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.materialCard, { backgroundColor: theme.colors.background }]}
      onPress={() => navigation.navigate('MaterialDetail', { 
        materialId: item.id,
        materialTitle: item.title
      })}
    >
      <View style={styles.materialIconContainer}>
        {item.type === 'pdf' && (
          <Image
            source={require('../../assets/pdf-icon.png')}
            style={styles.materialIcon}
          />
        )}
        {item.type === 'image' && (
          <Image
            source={require('../../assets/image-icon.png')}
            style={styles.materialIcon}
          />
        )}
        {item.type === 'video' && (
          <Image
            source={require('../../assets/video-icon.png')}
            style={styles.materialIcon}
          />
        )}
        {item.type === 'embed' && (
          <Image
            source={require('../../assets/embed-icon.png')}
            style={styles.materialIcon}
          />
        )}
      </View>
      <View style={styles.materialContent}>
        <Text style={[styles.materialTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.materialDescription, { color: theme.colors.secondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render item forum
  const renderForumItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.forumCard, { backgroundColor: theme.colors.background }]}
      onPress={() => navigation.navigate('ClassForum', { 
        classId: item.class_id,
        className: 'Forum Diskusi'
      })}
    >
      <Text style={[styles.forumTitle, { color: theme.colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.forumContent, { color: theme.colors.secondary }]} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.forumMeta}>
        <Text style={[styles.forumDate, { color: theme.colors.primary }]}>
          {new Date(item.created_at).toLocaleDateString('id-ID')}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  if (isLoading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
          Memuat data...
        </Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              Selamat Datang,
            </Text>
            <Text style={[styles.nameText, { color: theme.colors.text }]}>
              {user?.full_name || 'Pengguna'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
            <Image
              source={
                user?.avatar_url 
                  ? { uri: user.avatar_url } 
                  : require('../../assets/default-avatar.png')
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Featured Course */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Kelas Unggulan
          </Text>
          <TouchableOpacity
            style={[styles.featuredCard, { backgroundColor: theme.colors.card }]}
            onPress={() => 
              navigation.navigate('ClassDetail', { 
                classId: '1', 
                className: 'Pengenalan Lingkungan Hidup' 
              })
            }
          >
            <Image source={require('../../assets/logo-placeholder.png')} style={styles.featuredImage} />
            <View style={styles.featuredContent}>
              <Text style={[styles.featuredTitle, { color: theme.colors.text }]}>
                Pengenalan Lingkungan Hidup
              </Text>
              <Text 
                style={[styles.featuredDescription, { color: theme.colors.secondary }]}
                numberOfLines={2}
              >
                Pelajari dasar-dasar tentang lingkungan hidup dan bagaimana kita dapat berkontribusi untuk melestarikannya.
              </Text>
              <TouchableOpacity 
                style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.startButtonText}>Mulai Belajar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Classes */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Kelas Terakhir
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Class' as never)}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentClassesContainer}>
            {classes.slice(0, 2).map(course => (
              <TouchableOpacity
                key={course.id}
                style={[styles.recentClassCard, { backgroundColor: theme.colors.card }]}
                onPress={() => 
                  navigation.navigate('ClassDetail', { 
                    classId: course.id, 
                    className: course.name 
                  })
                }
              >
                <Image source={require('../../assets/logo-placeholder.png')} style={styles.recentClassImage} />
                <View style={styles.recentClassContent}>
                  <Text 
                    style={[styles.recentClassTitle, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {course.name}
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
                            width: '30%' 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.progressText, { color: theme.colors.secondary }]}>
                      30% selesai
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Eco News */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Berita Eco
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>
          
          {latestForumPosts.map(post => (
            <TouchableOpacity
              key={post.id}
              style={[styles.newsCard, { backgroundColor: theme.colors.card }]}
            >
              <Image source={require('../../assets/logo-placeholder.png')} style={styles.newsImage} />
              <View style={styles.newsContent}>
                <Text 
                  style={[styles.newsTitle, { color: theme.colors.text }]}
                  numberOfLines={2}
                >
                  {post.title}
                </Text>
                <Text style={[styles.newsDate, { color: theme.colors.secondary }]}>
                  {new Date(post.created_at).toLocaleDateString('id-ID')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuredCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  startButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recentClassesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentClassCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentClassImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  recentClassContent: {
    padding: 12,
  },
  recentClassTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    height: 40, // Fixed height for 2 lines
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    textAlign: 'right',
  },
  newsCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newsImage: {
    width: 80,
    height: 80,
  },
  newsContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 12,
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
  classCard: {
    width: 200,
    height: 120,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
  },
  classCardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  classCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classCardCode: {
    fontSize: 12,
  },
  materialCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  materialIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  materialIcon: {
    width: 40,
    height: 40,
  },
  materialContent: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  materialDescription: {
    fontSize: 14,
  },
  forumCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  forumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  forumContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  forumMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forumDate: {
    fontSize: 12,
  },
});

export default HomeScreen; 