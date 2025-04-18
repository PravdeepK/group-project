import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  getNotCompletedQuestions,
  updateNotCompletedAfterAttempt,
  saveCompletedQuestions,
  saveFailedQuestions
} from "../utils/scoreboardStorage";

// again same as test screen but only with new questions

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const TryNewQuestionsScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

    // Load questions from the storage
  useEffect(() => {
    const loadQuestions = async () => {
      const notCompleted = await getNotCompletedQuestions();

      if (notCompleted.length === 0) return;

      const randomized = shuffleArray(notCompleted).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));

      setQuestions(randomized);
    };

    loadQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    const current = questions[currentQuestionIndex];
    const isCorrect = answer === current.answer;

    current.userSelected = answer;
    setSelectedAnswer(answer);
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);

        const passed = [];
        const failed = [];

        questions.forEach((q) => {
          if (q.userSelected === q.answer) {
            passed.push(q);
          } else {
            failed.push(q);
          }
        });

        // Save the results
        saveCompletedQuestions(passed);
        saveFailedQuestions(failed);
        updateNotCompletedAfterAttempt([...passed, ...failed]);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
    const reshuffled = shuffleArray(questions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(reshuffled);
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 All questions have been attempted!</Text>
      </View>
    );
  }

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
                selectedAnswer !== null &&
                  option === questions[currentQuestionIndex].answer && {
                    backgroundColor: "#27ae60",
                  },
                selectedAnswer === option &&
                  selectedAnswer !== questions[currentQuestionIndex].answer && {
                    backgroundColor: "#e74c3c",
                  },
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
          <Text style={styles.resultTitle}>Try New Questions Complete!</Text>
          <Text style={styles.scoreText}>
            Score: {score}/{questions.length}
          </Text>

          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.buttonText}>Retry New</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2f5" },
  progressText: { color: "#7f8c8d", marginBottom: 20, textAlign: "center" },
  questionBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: { fontSize: 18, color: "#2c3e50", lineHeight: 24 },
  optionButton: {
    backgroundColor: "#ecf0f1",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: { fontSize: 16, color: "#2c3e50" },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: "#2c3e50",
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    marginBottom: 10,
  },
  homeButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
});

export default TryNewQuestionsScreen;
