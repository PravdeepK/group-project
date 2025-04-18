import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import questionsData from '../data/questions.json';
import {
  updateScoreboard,
  recordTestResult,
  saveFailedQuestions,
  updateNotCompletedAfterAttempt
} from '../utils/scoreboardStorage';

//randomize the array of questions and  options for the test
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// TestScreen component
const TestScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctQuestions, setCorrectQuestions] = useState([]);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  // Shuffle and select 15 questions from the data
  // and randomize the options for each question
  useEffect(() => {
    const shuffled = [...questionsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15)
      .map(q => ({ ...q, options: shuffleArray(q.options) }));
    setQuestions(shuffled);
  }, []);

  // Handle answer selection
  // Check if the selected answer is correct
  // Update score and correct/wrong questions
  // After a delay, move to the next question or finish the quiz
  const handleAnswerSelect = async (answer) => {
    const current = questions[currentQuestionIndex];
    const isCorrect = answer === current.answer;

    setSelectedAnswer(answer);

    // Update the current question with the user's selected answer and saves it if its wrong or right
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCorrectQuestions(prev => [...prev, current]);
    } else {
      setWrongQuestions(prev => [...prev, current]);
    }

    // Simulate a delay for the user to see the answer
    setTimeout(async () => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz finished
        // Save the test result and update the scoreboard
        const finalScore = isCorrect ? score + 1 : score;
        setQuizFinished(true);

        const completed = [...correctQuestions, ...wrongQuestions];
        if (!isCorrect) completed.push(current);

        await recordTestResult({
          score: finalScore,
          total: questions.length,
          correctQuestions,
          wrongQuestions
        });

        await saveFailedQuestions([...wrongQuestions, ...(isCorrect ? [] : [current])]);
        await updateScoreboard(finalScore === questions.length);

        // removes attempted questions from notCompleted
        await updateNotCompletedAfterAttempt(completed);
      }
    }, 2000);
  };

  // Restart the quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
    setCorrectQuestions([]);
    setWrongQuestions([]);
    const reshuffled = [...questionsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15)
      .map(q => ({ ...q, options: shuffleArray(q.options) }));
    setQuestions(reshuffled);
  };

  return (
    // Main container
    <View style={styles.container}>
      {!quizFinished ? (
        <>
          <Text style={styles.progressText}>Question {currentQuestionIndex + 1}/{questions.length}</Text>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex]?.question}
            </Text>
          </View>
          {questions[currentQuestionIndex]?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer !== null && option === questions[currentQuestionIndex].answer && {
                  backgroundColor: '#27ae60'
                },
                selectedAnswer === option &&
                selectedAnswer !== questions[currentQuestionIndex].answer && {
                  backgroundColor: '#e74c3c'
                }
              ]}
              onPress={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        // Quiz result screen
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Test Completed!</Text>
          <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>

          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5' },
  progressText: { color: '#7f8c8d', marginBottom: 20, textAlign: 'center' },
  questionBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  questionText: { fontSize: 18, color: '#2c3e50', lineHeight: 24 },
  optionButton: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  optionText: { fontSize: 16, color: '#2c3e50' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  scoreText: { fontSize: 20, color: '#2c3e50', marginBottom: 30 },
  restartButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginBottom: 10
  },
  homeButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default TestScreen;
