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
        if (answer === questions[currentQuestionIndex].answer) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
            } else {
                setQuizFinished(true);
                updateScoreboard(score + 1 === questions.length);
            }
        }, 1000);
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
                    <Text style={styles.title}>G1 Test</Text>
                    <Text style={styles.question}>{questions[currentQuestionIndex]?.question}</Text>
                    
                    {questions[currentQuestionIndex]?.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                selectedAnswer === option
                                    ? option === questions[currentQuestionIndex].answer
                                        ? styles.correctAnswer
                                        : styles.wrongAnswer
                                    : null
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
                    <Text style={styles.resultText}>Quiz Finished!</Text>
                    <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
                    <Button title="Restart Quiz" onPress={restartQuiz} />
                    <Button title="Back to Home" onPress={() => navigation.goBack()} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    question: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
    optionButton: { width: '80%', padding: 15, marginVertical: 5, backgroundColor: '#ddd', borderRadius: 10 },
    optionText: { fontSize: 16, textAlign: 'center' },
    correctAnswer: { backgroundColor: '#4CAF50' },
    wrongAnswer: { backgroundColor: '#F44336' },
    resultContainer: { alignItems: 'center' },
    resultText: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    scoreText: { fontSize: 20, marginBottom: 20 }
});

export default TestScreen;
