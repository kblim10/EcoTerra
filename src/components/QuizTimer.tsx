import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

interface QuizTimerProps {
  duration: number; // dalam menit
  onTimeUp: () => void;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ duration, onTimeUp }) => {
  const theme = useTheme();
  
  // Konversi durasi dari menit ke detik
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  
  useEffect(() => {
    // Jika waktu sudah habis
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    // Set interval untuk mengurangi waktu setiap detik
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    // Cleanup interval saat komponen unmount
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);
  
  // Format waktu ke dalam format menit:detik
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Hitung persentase waktu yang tersisa
  const percentageLeft = (timeLeft / (duration * 60)) * 100;
  
  // Tentukan warna berdasarkan persentase waktu yang tersisa
  const getTimerColor = () => {
    if (percentageLeft > 50) {
      return theme.colors.success;
    } else if (percentageLeft > 20) {
      return theme.colors.warning;
    } else {
      return theme.colors.error;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View 
          style={[
            styles.timerProgress, 
            { 
              width: `${percentageLeft}%`,
              backgroundColor: getTimerColor() 
            }
          ]} 
        />
      </View>
      <Text style={[styles.timerText, { color: getTimerColor() }]}>
        {formatTime()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  timerContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  timerProgress: {
    height: '100%',
    borderRadius: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizTimer; 