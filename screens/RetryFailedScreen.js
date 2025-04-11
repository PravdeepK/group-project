import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getFailedQuestions } from '../utils/scoreboardStorage';

const RetryFailedScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const load = async () => {
      const failed = await getFailedQuestions();
      setQuestions(failed.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      })));
    };
    load();
  }, []);

  const handleAnswerSelect = (answer) => {
    const correct = questions[currentQuestionIndex].answer;
    setSelectedAnswer(answer);
    if (answer === correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);
      }
    }, 2000);
  };

  const restart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <View style={styles.container}>
      {!quizFinished ? (
        <>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1}/{questions.length}
          </Text>
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
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Finished!</Text>
          <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restart}>
            <Text style={styles.buttonText}>Retry Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({ /* reuse from TestScreen */ });

export default RetryFailedScreen;
