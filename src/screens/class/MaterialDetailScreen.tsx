import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/ThemeContext';

const MaterialDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const theme = useTheme();
  const { materialId, materialTitle } = route.params;

  // Dummy data untuk material
  const material = {
    id: materialId || '1',
    title: materialTitle || 'Pengenalan Konsep Lingkungan Hidup',
    type: 'pdf',
    content: 'Lingkungan hidup adalah kesatuan ruang dengan semua benda, daya, keadaan, dan makhluk hidup, termasuk di dalamnya manusia dan perilakunya, yang mempengaruhi kelangsungan perikehidupan dan kesejahteraan manusia serta makhluk hidup lainnya.\n\nKonsep lingkungan hidup mencakup berbagai aspek interaksi antara manusia dan alam sekitarnya. Pemahaman yang baik tentang konsep ini sangat penting untuk mendukung upaya pelestarian lingkungan dan pembangunan berkelanjutan.\n\nBeberapa komponen utama lingkungan hidup meliputi:\n\n1. Komponen Biotik: Meliputi semua makhluk hidup seperti tumbuhan, hewan, mikroorganisme, dan manusia.\n\n2. Komponen Abiotik: Meliputi semua benda mati dan energi seperti tanah, air, udara, sinar matahari, dan mineral.\n\n3. Komponen Sosial: Meliputi sistem nilai, norma, dan budaya yang dianut oleh masyarakat dalam berinteraksi dengan lingkungan.\n\nEkosistem adalah satuan fungsional dasar dalam ekologi yang mencakup organisme dan lingkungannya. Dalam ekosistem terjadi aliran energi dan siklus materi yang menghubungkan komponen biotik dan abiotik. Keseimbangan ekosistem sangat penting untuk menjaga keberlanjutan lingkungan hidup.',
    author: 'Dr. Budi Santoso',
    datePublished: '10 Januari 2023',
    readTime: '15 menit',
    image: require('../../assets/logo-placeholder.png'),
  };

  // Tracking completed state
  const [isCompleted, setIsCompleted] = useState(false);

  // Handle mark as completed
  const handleMarkAsCompleted = () => {
    setIsCompleted(true);
    // In a real app, would update the user's progress in a database
  };

  // Render content based on material type
  const renderMaterialContent = () => {
    switch (material.type) {
      case 'pdf':
        return (
          <View style={styles.documentContainer}>
            <Image 
              source={require('../../assets/pdf-icon.png')} 
              style={styles.documentIcon} 
            />
            <Text style={[styles.documentText, { color: theme.colors.text }]}>
              {material.content}
            </Text>
          </View>
        );
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <View style={[styles.videoPlayer, { backgroundColor: theme.colors.card }]}>
              <Image 
                source={require('../../assets/logo-placeholder.png')} 
                style={styles.videoThumbnail} 
              />
              <TouchableOpacity style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.playButtonText}>▶</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.videoDescription, { color: theme.colors.text }]}>
              {material.content}
            </Text>
          </View>
        );
      default:
        return (
          <Text style={[styles.contentText, { color: theme.colors.text }]}>
            {material.content}
          </Text>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Material Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {material.title}
          </Text>
          
          <View style={styles.metaInfo}>
            <Text style={[styles.author, { color: theme.colors.secondary }]}>
              Oleh: {material.author}
            </Text>
            <Text style={[styles.date, { color: theme.colors.secondary }]}>
              Diterbitkan: {material.datePublished}
            </Text>
            <Text style={[styles.readTime, { color: theme.colors.primary }]}>
              Waktu baca: {material.readTime}
            </Text>
          </View>
        </View>
        
        {/* Material Content */}
        <View style={styles.contentContainer}>
          {renderMaterialContent()}
        </View>
        
        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor: isCompleted
                ? theme.colors.secondary
                : theme.colors.primary,
            },
          ]}
          onPress={handleMarkAsCompleted}
          disabled={isCompleted}
        >
          <Text style={styles.completeButtonText}>
            {isCompleted ? 'Telah Selesai' : 'Tandai Selesai'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  metaInfo: {
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    marginBottom: 5,
  },
  readTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  documentContainer: {
    alignItems: 'center',
  },
  documentIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  documentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  videoContainer: {
    marginBottom: 20,
  },
  videoPlayer: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: 'white',
    fontSize: 24,
  },
  videoDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  completeButton: {
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MaterialDetailScreen; 