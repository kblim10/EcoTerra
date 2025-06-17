import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ClassScreen from '../screens/main/ClassScreen';
import ForumScreen from '../screens/main/ForumScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ClassDetailScreen from '../screens/class/ClassDetailScreen';
import MaterialDetailScreen from '../screens/class/MaterialDetailScreen';
import QuizScreen from '../screens/class/QuizScreen';
import LeaderboardScreen from '../screens/class/LeaderboardScreen';
import ClassForumScreen from '../screens/class/ClassForumScreen';

// Tipe parameter untuk Stack Navigator
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ClassDetail: { classId: string; className: string };
  MaterialDetail: { materialId: string; materialTitle: string };
  Quiz: { quizId: string; quizTitle: string; duration: number };
  Leaderboard: { classId: string };
  ClassForum: { classId: string; className: string };
};

// Tipe parameter untuk Auth Stack Navigator
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Tipe parameter untuk Tab Navigator
type MainTabParamList = {
  Home: undefined;
  Class: undefined;
  Forum: undefined;
  Profile: undefined;
};

// Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator Component
const AuthNavigator = () => {
  const theme = useTheme();
  
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator Component
const MainTabNavigator = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Class') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Forum') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Class" component={ClassScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Root Navigator Component
const AppNavigator = () => {
  const theme = useTheme();
  
  // Dummy auth state - in real app, use Supabase auth
  const isAuthenticated = false;
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabNavigator} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
            <Stack.Screen name="MaterialDetail" component={MaterialDetailScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="ClassForum" component={ClassForumScreen} />
          </>
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 