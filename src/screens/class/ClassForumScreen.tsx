import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../utils/ThemeContext';

const ClassForumScreen = () => {
  const route = useRoute<any>();
  const theme = useTheme();
  const { classId, className } = route.params;

  const [newPostModalVisible, setNewPostModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Dummy data untuk forum posts
  const forumPosts = [
    {
      id: '1',
      title: 'Bagaimana dampak perubahan iklim terhadap keanekaragaman hayati?',
      content: 'Saya ingin mengetahui lebih banyak tentang bagaimana perubahan iklim mempengaruhi keanekaragaman hayati di Indonesia. Adakah yang bisa berbagi penelitian terbaru tentang hal ini?',
      author: 'Ahmad Rizki',
      authorAvatar: require('../../assets/default-avatar.png'),
      date: '2 jam yang lalu',
      replies: 8,
      likes: 12,
      isLiked: false,
    },
    {
      id: '2',
      title: 'Tips pengelolaan sampah di rumah tangga',
      content: 'Saya sudah mencoba beberapa metode untuk mengelola sampah di rumah, seperti pemilahan dan komposting. Apa tips dari teman-teman untuk pengelolaan sampah yang efektif?',
      author: 'Siti Nurhaliza',
      authorAvatar: require('../../assets/default-avatar.png'),
      date: '1 hari yang lalu',
      replies: 15,
      likes: 23,
      isLiked: true,
    },
    {
      id: '3',
      title: 'Rekomendasi buku tentang lingkungan hidup',
      content: 'Saya sedang mencari rekomendasi buku yang bagus tentang lingkungan hidup dan ekologi. Boleh sharing apa yang sedang kalian baca?',
      author: 'Budi Santoso',
      authorAvatar: require('../../assets/default-avatar.png'),
      date: '2 hari yang lalu',
      replies: 10,
      likes: 18,
      isLiked: false,
    },
    {
      id: '4',
      title: 'Diskusi: Energi terbarukan di Indonesia',
      content: 'Bagaimana pendapat teman-teman tentang perkembangan energi terbarukan di Indonesia? Apa tantangan utama dan bagaimana solusinya?',
      author: 'Dina Maulida',
      authorAvatar: require('../../assets/default-avatar.png'),
      date: '3 hari yang lalu',
      replies: 20,
      likes: 35,
      isLiked: false,
    },
    {
      id: '5',
      title: 'Project sustainability di komunitas',
      content: 'Saya sedang merencanakan project sustainability di komunitas tempat tinggal saya. Ada yang punya pengalaman atau saran yang bisa dibagikan?',
      author: 'Rudi Hermawan',
      authorAvatar: require('../../assets/default-avatar.png'),
      date: '5 hari yang lalu',
      replies: 12,
      likes: 19,
      isLiked: true,
    },
  ];

  // Handle like post
  const handleLikePost = (postId: string) => {
    // In a real app, this would update the database
    console.log(`Post ${postId} liked`);
  };

  // Handle create new post
  const handleCreatePost = () => {
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      // Show validation error in real app
      return;
    }
    
    // In a real app, this would create a new post in the database
    console.log('Creating new post:', { title: newPostTitle, content: newPostContent });
    
    // Reset form and close modal
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostModalVisible(false);
  };

  // Render forum post item
  const renderForumPost = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[styles.postCard, { backgroundColor: theme.colors.card }]}
      >
        <View style={styles.postHeader}>
          <Image source={item.authorAvatar} style={styles.authorAvatar} />
          <View style={styles.postHeaderInfo}>
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
        
        <Text 
          style={[styles.postContent, { color: theme.colors.text }]}
          numberOfLines={3}
        >
          {item.content}
        </Text>
        
        <View style={styles.postStats}>
          <TouchableOpacity
            style={styles.postStat}
            onPress={() => handleLikePost(item.id)}
          >
            <Text 
              style={[
                styles.postStatText, 
                { 
                  color: item.isLiked ? theme.colors.primary : theme.colors.secondary 
                }
              ]}
            >
              {item.isLiked ? '❤ ' : '♡ '}{item.likes} Suka
            </Text>
          </TouchableOpacity>
          
          <View style={styles.postStat}>
            <Text style={[styles.postStatText, { color: theme.colors.secondary }]}>
              💬 {item.replies} Balasan
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Forum Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Forum Diskusi: {className}
        </Text>
        <Text style={[styles.headerDescription, { color: theme.colors.secondary }]}>
          Diskusikan materi kelas, berbagi pengalaman, dan ajukan pertanyaan bersama teman sekelas.
        </Text>
      </View>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
          placeholder="Cari diskusi..."
          placeholderTextColor={theme.colors.secondary}
        />
      </View>
      
      {/* Post List */}
      <FlatList
        data={forumPosts}
        renderItem={renderForumPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postList}
      />
      
      {/* New Post Button */}
      <TouchableOpacity
        style={[styles.newPostButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setNewPostModalVisible(true)}
      >
        <Text style={styles.newPostButtonText}>+ Buat Diskusi Baru</Text>
      </TouchableOpacity>
      
      {/* New Post Modal */}
      <Modal
        visible={newPostModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNewPostModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Buat Diskusi Baru
            </Text>
            
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Judul
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Masukkan judul diskusi..."
              placeholderTextColor={theme.colors.secondary}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />
            
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Konten
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Tulis isi diskusi Anda di sini..."
              placeholderTextColor={theme.colors.secondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={newPostContent}
              onChangeText={setNewPostContent}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'transparent', borderColor: theme.colors.border }]}
                onPress={() => setNewPostModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
                  Batal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleCreatePost}
              >
                <Text style={styles.createButtonText}>
                  Posting
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  postList: {
    padding: 15,
    paddingBottom: 80, // Extra space for floating button
  },
  postCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postHeaderInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  postDate: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  postStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  postStat: {
    marginRight: 20,
  },
  postStatText: {
    fontSize: 14,
  },
  newPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 14,
    minHeight: 120,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ClassForumScreen; 