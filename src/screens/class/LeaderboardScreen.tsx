import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../utils/ThemeContext';

const LeaderboardScreen = () => {
  const route = useRoute<any>();
  const theme = useTheme();
  const { classId } = route.params;

  // Tab aktif (mingguan/bulanan/semua waktu)
  const [activeTab, setActiveTab] = useState('weekly');

  // Dummy data leaderboard
  const leaderboardData = [
    {
      id: '1',
      name: 'Ahmad Rizki',
      points: 780,
      rank: 1,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 12,
      quizAverage: 92,
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      points: 765,
      rank: 2,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 12,
      quizAverage: 90,
    },
    {
      id: '3',
      name: 'Budi Santoso',
      points: 720,
      rank: 3,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 11,
      quizAverage: 85,
    },
    {
      id: '4',
      name: 'Rina Marlina',
      points: 695,
      rank: 4,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 10,
      quizAverage: 87,
    },
    {
      id: '5',
      name: 'Deni Pratama',
      points: 670,
      rank: 5,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 10,
      quizAverage: 80,
    },
    {
      id: '6',
      name: 'Lina Anggraini',
      points: 650,
      rank: 6,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 9,
      quizAverage: 82,
    },
    {
      id: '7',
      name: 'Faisal Akbar',
      points: 620,
      rank: 7,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 9,
      quizAverage: 78,
    },
    {
      id: '8',
      name: 'Maya Putri',
      points: 590,
      rank: 8,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 8,
      quizAverage: 75,
    },
    {
      id: '9',
      name: 'Rudi Hermawan',
      points: 560,
      rank: 9,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 8,
      quizAverage: 73,
    },
    {
      id: '10',
      name: 'Dewi Lestari',
      points: 530,
      rank: 10,
      avatar: require('../../assets/default-avatar.png'),
      completedModules: 7,
      quizAverage: 70,
    },
  ];

  // Posisi user dalam leaderboard (contoh)
  const userRank = {
    id: 'user',
    name: 'Anda (Pengguna EcoTerra)',
    points: 610,
    rank: 8,
    avatar: require('../../assets/default-avatar.png'),
    completedModules: 9,
    quizAverage: 76,
  };

  // Render header leaderboard (top 3)
  const renderLeaderboardHeader = () => {
    // Ambil 3 teratas
    const topThree = leaderboardData.slice(0, 3);
    
    return (
      <View style={styles.topThreeContainer}>
        {/* Peringkat 2 */}
        <View style={styles.topUserContainer}>
          <View style={[styles.topUserAvatar, { backgroundColor: theme.colors.secondary }]}>
            <Text style={styles.topUserRank}>2</Text>
            <Image source={topThree[1].avatar} style={styles.topUserImage} />
          </View>
          <Text style={[styles.topUserName, { color: theme.colors.text }]} numberOfLines={1}>
            {topThree[1].name}
          </Text>
          <Text style={[styles.topUserPoints, { color: theme.colors.secondary }]}>
            {topThree[1].points} poin
          </Text>
        </View>
        
        {/* Peringkat 1 */}
        <View style={[styles.topUserContainer, styles.firstRankContainer]}>
          <View style={[styles.topUserAvatar, styles.firstRankAvatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.topUserRank}>1</Text>
            <Image source={topThree[0].avatar} style={styles.topUserImage} />
          </View>
          <Text style={[styles.topUserName, { color: theme.colors.text }]} numberOfLines={1}>
            {topThree[0].name}
          </Text>
          <Text style={[styles.topUserPoints, { color: theme.colors.primary }]}>
            {topThree[0].points} poin
          </Text>
        </View>
        
        {/* Peringkat 3 */}
        <View style={styles.topUserContainer}>
          <View style={[styles.topUserAvatar, { backgroundColor: theme.colors.accent2 }]}>
            <Text style={styles.topUserRank}>3</Text>
            <Image source={topThree[2].avatar} style={styles.topUserImage} />
          </View>
          <Text style={[styles.topUserName, { color: theme.colors.text }]} numberOfLines={1}>
            {topThree[2].name}
          </Text>
          <Text style={[styles.topUserPoints, { color: theme.colors.accent2 }]}>
            {topThree[2].points} poin
          </Text>
        </View>
      </View>
    );
  };

  // Render item leaderboard
  const renderLeaderboardItem = ({ item }: { item: any }) => {
    const isCurrentUser = item.id === 'user';
    
    return (
      <View 
        style={[
          styles.leaderboardItem, 
          { 
            backgroundColor: isCurrentUser ? theme.colors.primary + '10' : theme.colors.card 
          }
        ]}
      >
        <Text style={[styles.rankNumber, { color: theme.colors.text }]}>
          {item.rank}
        </Text>
        
        <Image source={item.avatar} style={styles.userAvatar} />
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {item.name} {isCurrentUser && '(Anda)'}
          </Text>
          <View style={styles.userStats}>
            <Text style={[styles.userPoints, { color: theme.colors.primary }]}>
              {item.points} poin
            </Text>
            <Text style={[styles.userDetail, { color: theme.colors.secondary }]}>
              {item.completedModules} modul • {item.quizAverage}% rata-rata kuis
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tab Filter */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'weekly' && { 
              backgroundColor: theme.colors.primary + '20',
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'weekly' ? theme.colors.primary : theme.colors.secondary,
                fontWeight: activeTab === 'weekly' ? 'bold' : 'normal',
              },
            ]}
          >
            Mingguan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'monthly' && {
              backgroundColor: theme.colors.primary + '20',
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('monthly')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'monthly' ? theme.colors.primary : theme.colors.secondary,
                fontWeight: activeTab === 'monthly' ? 'bold' : 'normal',
              },
            ]}
          >
            Bulanan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'alltime' && {
              backgroundColor: theme.colors.primary + '20',
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('alltime')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'alltime' ? theme.colors.primary : theme.colors.secondary,
                fontWeight: activeTab === 'alltime' ? 'bold' : 'normal',
              },
            ]}
          >
            Semua Waktu
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={leaderboardData.slice(3)}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            {renderLeaderboardHeader()}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Peringkat Lainnya
            </Text>
          </>
        )}
        ListFooterComponent={() => (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Peringkat Anda
            </Text>
            {renderLeaderboardItem({ item: userRank })}
            <View style={styles.footer} />
          </>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
    marginTop: 10,
  },
  topUserContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 80,
  },
  firstRankContainer: {
    marginTop: -20,
  },
  topUserAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  firstRankAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  topUserRank: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 20,
    zIndex: 1,
  },
  topUserImage: {
    width: '80%',
    height: '80%',
    borderRadius: 30,
  },
  topUserName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  topUserPoints: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userPoints: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
  },
  userDetail: {
    fontSize: 12,
  },
  footer: {
    height: 50,
  },
});

export default LeaderboardScreen; 