import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { useTheme } from '../../utils/ThemeContext';
import { supabase } from '../../services/supabaseClient';
import { useAuthStore } from '../../store/authStore';
import QuizTimer from '../../components/QuizTimer';

interface Question {
  id: string;
  quiz_id: string;
  question: string;
  type: 'multiple_choice' | 'essay';
  options?: string[];
  correct_answer?: string;
  points: number;
}

interface Answer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  score?: number;
}

const QuizScreen = ({ route, navigation }: any) => {
  const { quizId, quizTitle, duration } = route.params;
  const theme = useTheme();
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  
  // Efek untuk memuat pertanyaan kuis
  useEffect(() => {
    // Set judul halaman
    navigation.setOptions({
      title: quizTitle || 'Kuis',
    });
    
    // Muat pertanyaan kuis
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizId);
          
        if (error) throw error;
        
        if (data) {
          setQuestions(data as Question[]);
          
          // Inisialisasi array jawaban kosong
          const initialAnswers = data.map((question: Question) => ({
            questionId: question.id,
            answer: '',
          }));
          
          setAnswers(initialAnswers);
          
          // Hitung total poin
          const total = data.reduce((sum: number, question: Question) => sum + question.points, 0);
          setTotalPoints(total);
        }
      } catch (error) {
        Alert.alert('Error', 'Gagal memuat pertanyaan kuis');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [quizId, navigation]);
  
  // Handler untuk jawaban pilihan ganda
  const handleMultipleChoiceAnswer = (questionId: string, answer: string) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(a => 
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
  };
  
  // Handler untuk jawaban esai
  const handleEssayAnswer = (questionId: string, answer: string) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(a => 
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
  };
  
  // Handler untuk navigasi ke pertanyaan sebelumnya
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Handler untuk navigasi ke pertanyaan berikutnya
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Handler untuk waktu habis
  const handleTimeUp = () => {
    Alert.alert(
      'Waktu Habis',
      'Waktu mengerjakan kuis telah habis. Kuis akan dikumpulkan secara otomatis.',
      [
        { text: 'OK', onPress: () => submitQuiz() }
      ]
    );
  };
  
  // Handler untuk mengumpulkan kuis
  const submitQuiz = async () => {
    setIsLoading(true);
    try {
      // Hitung skor untuk jawaban pilihan ganda
      const scoredAnswers = answers.map(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        
        if (!question) return answer;
        
        if (question.type === 'multiple_choice') {
          const isCorrect = answer.answer === question.correct_answer;
          const score = isCorrect ? question.points : 0;
          
          return {
            ...answer,
            isCorrect,
            score
          };
        }
        
        // Untuk esai, skor akan diberikan oleh guru
        return answer;
      });
      
      setAnswers(scoredAnswers);
      
      // Hitung total skor
      const score = scoredAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0);
      setTotalScore(score);
      
      // Simpan jawaban ke database
      const answersToSave = scoredAnswers.map(answer => ({
        student_id: user?.id,
        quiz_id: quizId,
        question_id: answer.questionId,
        answer: answer.answer,
        is_correct: answer.isCorrect,
        score: answer.score,
        submitted_at: new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('quiz_answers')
        .insert(answersToSave);
        
      if (error) throw error;
      
      setQuizSubmitted(true);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengumpulkan kuis');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render pertanyaan pilihan ganda
  const renderMultipleChoiceQuestion = (question: Question) => {
    const currentAnswer = answers.find(a => a.questionId === question.id)?.answer || '';
    
    return (
      <View style={styles.questionContainer}>
        <Text style={[styles.questionText, { color: theme.colors.text }]}>
          {question.question}
        </Text>
        <Text style={[styles.pointsText, { color: theme.colors.primary }]}>
          Poin: {question.points}
        </Text>
        
        <View style={styles.optionsContainer}>
          {question.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                {
                  backgroundColor: currentAnswer === option 
                    ? theme.colors.primary 
                    : 'rgba(0,0,0,0.05)',
                }
              ]}
              onPress={() => handleMultipleChoiceAnswer(question.id, option)}
              disabled={quizSubmitted}
            >
              <Text 
                style={[
                  styles.optionText, 
                  { 
                    color: currentAnswer === option 
                      ? theme.colors.textLight 
                      : theme.colors.text 
                  }
                ]}
              >
                {option}
              </Text>
              
              {quizSubmitted && (
                <View style={styles.resultIndicator}>
                  {option === question.correct_answer ? (
                    <Text style={[styles.correctText, { color: theme.colors.success }]}>
                      ✓ Benar
                    </Text>
                  ) : currentAnswer === option ? (
                    <Text style={[styles.incorrectText, { color: theme.colors.error }]}>
                      ✗ Salah
                    </Text>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  // Render pertanyaan esai
  const renderEssayQuestion = (question: Question) => {
    const currentAnswer = answers.find(a => a.questionId === question.id)?.answer || '';
    
    return (
      <View style={styles.questionContainer}>
        <Text style={[styles.questionText, { color: theme.colors.text }]}>
          {question.question}
        </Text>
        <Text style={[styles.pointsText, { color: theme.colors.primary }]}>
          Poin: {question.points}
        </Text>
        
        <TextInput
          style={[
            styles.essayInput,
            { 
              borderColor: theme.colors.accent2,
              color: theme.colors.text,
              backgroundColor: quizSubmitted ? 'rgba(0,0,0,0.05)' : 'transparent'
            }
          ]}
          multiline
          placeholder="Ketik jawaban Anda di sini..."
          placeholderTextColor="rgba(0,0,0,0.3)"
          value={currentAnswer}
          onChangeText={(text) => handleEssayAnswer(question.id, text)}
          editable={!quizSubmitted}
        />
      </View>
    );
  };
  
  // Render hasil kuis
  const renderQuizResult = () => {
    return (
      <View style={styles.resultContainer}>
        <Text style={[styles.resultTitle, { color: theme.colors.primary }]}>
          Kuis Selesai
        </Text>
        <Text style={[styles.resultScore, { color: theme.colors.text }]}>
          Skor: {totalScore} / {totalPoints}
        </Text>
        <Text style={[styles.resultPercentage, { color: theme.colors.secondary }]}>
          {Math.round((totalScore / totalPoints) * 100)}%
        </Text>
        
        <TouchableOpacity
          style={[styles.reviewButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.reviewButtonText, { color: theme.colors.textLight }]}>
            Selesai
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
          Memuat kuis...
        </Text>
      </View>
    );
  }
  
  if (quizSubmitted) {
    return (
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {renderQuizResult()}
      </ScrollView>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Timer */}
      <QuizTimer duration={duration} onTimeUp={handleTimeUp} />
      
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: 'rgba(0,0,0,0.1)',
            }
          ]}
        >
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                backgroundColor: theme.colors.primary
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.secondary }]}>
          {currentQuestionIndex + 1} dari {questions.length} pertanyaan
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Render pertanyaan sesuai tipe */}
        {currentQuestion?.type === 'multiple_choice' 
          ? renderMultipleChoiceQuestion(currentQuestion)
          : renderEssayQuestion(currentQuestion)
        }
      </ScrollView>
      
      {/* Navigasi pertanyaan */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton, 
            { 
              backgroundColor: currentQuestionIndex > 0 
                ? theme.colors.primary 
                : 'rgba(0,0,0,0.1)' 
            }
          ]}
          onPress={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.textLight }]}>
            Sebelumnya
          </Text>
        </TouchableOpacity>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
            onPress={goToNextQuestion}
          >
            <Text style={[styles.navButtonText, { color: theme.colors.textLight }]}>
              Selanjutnya
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.success }]}
            onPress={() => {
              Alert.alert(
                'Konfirmasi Pengumpulan',
                'Apakah Anda yakin ingin mengumpulkan kuis ini?',
                [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Ya', onPress: submitQuiz }
                ]
              );
            }}
          >
            <Text style={[styles.submitButtonText, { color: theme.colors.textLight }]}>
              Kumpulkan
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
  progressContainer: {
    padding: 15,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  resultIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  correctText: {
    fontWeight: 'bold',
  },
  incorrectText: {
    fontWeight: 'bold',
  },
  essayInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  navButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 20,
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  reviewButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default QuizScreen; 