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
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../utils/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { useClassStore } from '../../store/classStore';
import { supabase } from '../../services/supabaseClient';
import { MaterialData, ForumPostData } from '../../services/supabaseClient';

const HomeScreen = ({ navigation }: any) => {
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
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.colors.textLight }]}>
              Selamat datang,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.accent3 }]}>
              {user?.full_name || 'Pengguna'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
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
      </LinearGradient>
      
      {/* Kelas Saya */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Kelas Saya
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Class')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
              Lihat Semua
            </Text>
          </TouchableOpacity>
        </View>
        
        {classes.length > 0 ? (
          <FlatList
            data={classes.slice(0, 3)}
            renderItem={renderClassItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.classList}
          />
        ) : (
          <View style={[styles.emptyState, { borderColor: theme.colors.accent2 }]}>
            <Text style={[styles.emptyStateText, { color: theme.colors.secondary }]}>
              Anda belum bergabung dengan kelas apapun
            </Text>
            <TouchableOpacity
              style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Class')}
            >
              <Text style={[styles.joinButtonText, { color: theme.colors.textLight }]}>
                Gabung Kelas
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Materi Terbaru */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Materi Terbaru
          </Text>
        </View>
        
        {latestMaterials.length > 0 ? (
          latestMaterials.map((material) => (
            <View key={material.id}>
              {renderMaterialItem({ item: material })}
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { borderColor: theme.colors.accent2 }]}>
            <Text style={[styles.emptyStateText, { color: theme.colors.secondary }]}>
              Belum ada materi terbaru
            </Text>
          </View>
        )}
      </View>
      
      {/* Forum Diskusi */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Forum Diskusi
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Forum')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
              Lihat Semua
            </Text>
          </TouchableOpacity>
        </View>
        
        {latestForumPosts.length > 0 ? (
          latestForumPosts.map((post) => (
            <View key={post.id}>
              {renderForumItem({ item: post })}
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { borderColor: theme.colors.accent2 }]}>
            <Text style={[styles.emptyStateText, { color: theme.colors.secondary }]}>
              Belum ada diskusi terbaru
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  classList: {
    flexGrow: 0,
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
  emptyState: {
    padding: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  joinButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  joinButtonText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen; 