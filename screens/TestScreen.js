import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import questionsData from '../data/questions.json';
import { updateScoreboard } from '../utils/scoreboardStorage';

const TestScreen = ({ navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    useEffect(() => {
        const shuffledQuestions = [...questionsData].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
    }, []);

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        const correctAnswer = questions[currentQuestionIndex].answer;

        if (answer === correctAnswer) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
            } else {
                setQuizFinished(true);
                updateScoreboard(score + (answer === correctAnswer ? 1 : 0) === questions.length);
            }
        }, 2000);
    };

    const restartQuiz = () => {
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
                <Text style={styles.questionText}>{questions[currentQuestionIndex]?.question}</Text>
              </View>
    
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && {
                      backgroundColor: option === questions[currentQuestionIndex].answer 
                        ? '#27ae60' // Green if correct
                        : '#e74c3c' // Red if wrong
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
              <Text style={styles.resultTitle}>Test Completed!</Text>
              <Text style={styles.scoreText}>
                Score: {score}/{questions.length}
              </Text>
              <TouchableOpacity 
                style={styles.restartButton}
                onPress={restartQuiz}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f2f5'
      },
      progressText: {
        color: '#7f8c8d',
        marginBottom: 20,
        textAlign: 'center'
      },
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
      questionText: {
        fontSize: 18,
        color: '#2c3e50',
        lineHeight: 24
      },
      optionButton: {
        backgroundColor: '#ecf0f1',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10
      },
      optionText: {
        fontSize: 16,
        color: '#2c3e50'
      },
      resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20
      },
      scoreText: {
        fontSize: 20,
        color: '#2c3e50',
        marginBottom: 30
      },
      restartButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        width: '80%'
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
      }
    });
    
    export default TestScreen;