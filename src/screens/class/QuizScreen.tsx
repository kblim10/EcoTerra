import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/ThemeContext';

const QuizScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const theme = useTheme();
  const { quizId, quizTitle, duration } = route.params;

  // State untuk kuis
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Konversi menit ke detik
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Dummy data pertanyaan
  const questions = [
    {
      id: 1,
      question: 'Apa yang dimaksud dengan lingkungan hidup?',
      options: [
        'Kumpulan makhluk hidup dalam suatu ekosistem',
        'Kesatuan ruang dengan semua benda, daya, keadaan, dan makhluk hidup yang mempengaruhi kehidupan',
        'Tempat tinggal manusia dan hewan',
        'Kumpulan dari berbagai jenis tumbuhan',
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Apa yang BUKAN merupakan komponen biotik dalam ekosistem?',
      options: [
        'Tumbuhan',
        'Hewan',
        'Mikroorganisme',
        'Air',
      ],
      correctAnswer: 3,
    },
    {
      id: 3,
      question: 'Apa dampak utama dari pemanasan global?',
      options: [
        'Meningkatnya suhu rata-rata bumi',
        'Bertambahnya jumlah tumbuhan',
        'Meningkatnya kesuburan tanah',
        'Berkurangnya polusi udara',
      ],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: 'Manakah berikut ini yang merupakan contoh energi terbarukan?',
      options: [
        'Batu bara',
        'Minyak bumi',
        'Energi surya',
        'Gas alam',
      ],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: 'Apa yang dimaksud dengan daur ulang?',
      options: [
        'Membuang sampah ke tempat sampah',
        'Proses mengolah kembali material yang sudah tidak terpakai menjadi produk baru',
        'Menggunakan kembali barang tanpa mengubah bentuknya',
        'Mengubah sampah menjadi kompos',
      ],
      correctAnswer: 1,
    },
  ];

  // Format waktu tersisa (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Efek untuk timer mundur
  useEffect(() => {
    if (timeRemaining > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !quizCompleted) {
      finishQuiz();
    }
  }, [timeRemaining, quizCompleted]);

  // Handler untuk memilih jawaban
  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  // Handler untuk navigasi ke pertanyaan berikutnya
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handler untuk navigasi ke pertanyaan sebelumnya
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Hitung skor dan selesaikan kuis
  const finishQuiz = () => {
    // Hitung skor
    let correctCount = 0;
    Object.keys(selectedAnswers).forEach((questionIndex) => {
      const index = parseInt(questionIndex);
      if (selectedAnswers[index] === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = (correctCount / questions.length) * 100;
    setScore(calculatedScore);
    setQuizCompleted(true);
  };

  // Handler untuk konfirmasi penyelesaian kuis
  const handleFinishQuiz = () => {
    // Cek apakah semua pertanyaan sudah dijawab
    if (Object.keys(selectedAnswers).length < questions.length) {
      Alert.alert(
        'Konfirmasi',
        `Anda belum menjawab semua pertanyaan (${Object.keys(selectedAnswers).length}/${questions.length}). Yakin ingin menyelesaikan kuis?`,
        [
          { 
            text: 'Batal', 
            style: 'cancel' 
          },
          { 
            text: 'Selesai', 
            onPress: finishQuiz 
          },
        ]
      );
    } else {
      finishQuiz();
    }
  };

  // Handler untuk kembali ke halaman kelas setelah kuis selesai
  const handleBackToClass = () => {
    navigation.goBack();
  };

  // Render tampilan hasil quiz
  if (quizCompleted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.resultContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
            Hasil Quiz
          </Text>
          
          <View style={styles.scoreContainer}>
            <View 
              style={[
                styles.scoreCircle, 
                { 
                  borderColor: score >= 70 ? theme.colors.primary : theme.colors.error
                }
              ]}
            >
              <Text 
                style={[
                  styles.scoreText, 
                  { 
                    color: score >= 70 ? theme.colors.primary : theme.colors.error
                  }
                ]}
              >
                {Math.round(score)}%
              </Text>
            </View>
            
            <Text 
              style={[
                styles.scoreStatus, 
                { 
                  color: score >= 70 ? theme.colors.primary : theme.colors.error
                }
              ]}
            >
              {score >= 70 ? 'Lulus' : 'Belum Lulus'}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {Object.keys(selectedAnswers).length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
                Soal Dijawab
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {Math.round(score / 100 * questions.length)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
                Jawaban Benar
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {questions.length - Math.round(score / 100 * questions.length)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
                Jawaban Salah
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleBackToClass}
          >
            <Text style={styles.backButtonText}>
              Kembali ke Kelas
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Pertanyaan saat ini
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.quizTitle, { color: theme.colors.text }]}>
          {quizTitle || 'Quiz Pengetahuan Dasar Lingkungan'}
        </Text>
        
        <View style={styles.timerContainer}>
          <Text style={[styles.timerLabel, { color: theme.colors.secondary }]}>
            Waktu tersisa:
          </Text>
          <Text 
            style={[
              styles.timerValue, 
              { 
                color: timeRemaining < 60 ? theme.colors.error : theme.colors.primary 
              }
            ]}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.secondary }]}>
            Soal {currentQuestionIndex + 1} dari {questions.length}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: theme.colors.primary,
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                }
              ]} 
            />
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Pertanyaan */}
        <View style={[styles.questionContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            {currentQuestion.question}
          </Text>
          
          {/* Opsi Jawaban */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  { 
                    backgroundColor: 
                      selectedAnswers[currentQuestionIndex] === index 
                        ? theme.colors.primary + '20'
                        : theme.colors.card,
                    borderColor: 
                      selectedAnswers[currentQuestionIndex] === index 
                        ? theme.colors.primary
                        : theme.colors.border,
                  }
                ]}
                onPress={() => handleSelectAnswer(currentQuestionIndex, index)}
              >
                <View 
                  style={[
                    styles.optionIndicator, 
                    { 
                      backgroundColor: 
                        selectedAnswers[currentQuestionIndex] === index 
                          ? theme.colors.primary
                          : theme.colors.background,
                      borderColor: 
                        selectedAnswers[currentQuestionIndex] === index 
                          ? theme.colors.primary
                          : theme.colors.border,
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.optionIndicatorText, 
                      { 
                        color: 
                          selectedAnswers[currentQuestionIndex] === index 
                            ? 'white'
                            : theme.colors.text 
                      }
                    ]}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: theme.colors.text }]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
            }
          ]}
          onPress={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
            Sebelumnya
          </Text>
        </TouchableOpacity>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleFinishQuiz}
          >
            <Text style={[styles.navButtonText, { color: 'white' }]}>
              Selesai
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleNextQuestion}
          >
            <Text style={[styles.navButtonText, { color: 'white' }]}>
              Selanjutnya
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerLabel: {
    fontSize: 14,
    marginRight: 5,
  },
  timerValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  optionIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
  },
  optionIndicatorText: {
    fontWeight: 'bold',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    width: '48%',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizScreen; 