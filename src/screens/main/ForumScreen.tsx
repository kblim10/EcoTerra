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
import { useTheme } from '../../utils/ThemeContext';

// Dummy data untuk forum
const dummyForumPosts = [
  {
    id: '1',
    title: 'Bagaimana cara memulai daur ulang di rumah?',
    author: 'Dina Setiawan',
    date: '2 jam yang lalu',
    replies: 8,
    views: 45,
    avatar: require('../../assets/default-avatar.png'),
  },
  {
    id: '2',
    title: 'Rekomendasi tanaman yang mudah ditanam di pekarangan rumah',
    author: 'Budi Prakoso',
    date: '5 jam yang lalu',
    replies: 12,
    views: 78,
    avatar: require('../../assets/default-avatar.png'),
  },
  {
    id: '3',
    title: 'Diskusi: Bagaimana mengurangi penggunaan plastik sekali pakai?',
    author: 'Ratna Dewi',
    date: '1 hari yang lalu',
    replies: 24,
    views: 132,
    avatar: require('../../assets/default-avatar.png'),
  },
  {
    id: '4',
    title: 'Tips menghemat energi listrik di rumah',
    author: 'Ahmad Ridwan',
    date: '2 hari yang lalu',
    replies: 15,
    views: 98,
    avatar: require('../../assets/default-avatar.png'),
  },
];

const ForumScreen = () => {
  const theme = useTheme();

  const renderForumItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.forumCard, { backgroundColor: theme.colors.card }]}
        onPress={() => {
          // Navigate to forum detail in the future
        }}
      >
        <View style={styles.forumHeader}>
          <Image source={item.avatar} style={styles.avatar} />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: theme.colors.text }]}>
              {item.author}
            </Text>
            <Text style={[styles.postDate, { color: theme.colors.secondary }]}>
              {item.date}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.postTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {item.replies}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
              Balasan
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {item.views}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
              Dilihat
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={dummyForumPosts}
        renderItem={renderForumItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <TouchableOpacity
        style={[styles.newPostButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // Navigate to create new post screen in the future
        }}
      >
        <Text style={styles.newPostButtonText}>Buat Diskusi Baru</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra space for the floating button
  },
  forumCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  forumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postDate: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  stat: {
    marginRight: 24,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  newPostButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  newPostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ForumScreen; 